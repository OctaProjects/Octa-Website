import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from './src/generated/prisma/client.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// cPanel provides PORT in environment variables
const PORT = Number(process.env.PORT || 3000)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret'
const COOKIE_NAME = 'octa_session'

const distPath = path.join(__dirname, 'build')

app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

function getRequestMeta(req) {
  return {
    ip: req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress || null,
    userAgent: req.headers['user-agent'] || null,
  }
}

async function audit(req, { actorId, action, entityType, entityId, metadata }) {
  const { ip, userAgent } = getRequestMeta(req)
  await prisma.auditLog.create({
    data: {
      actorId: actorId || null,
      action,
      entityType: entityType || null,
      entityId: entityId || null,
      metadata: metadata ?? undefined,
      ip: ip || null,
      userAgent: userAgent || null,
    },
  })
}

function signSession(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '12h' })
}

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return res.status(401).json({ error: 'unauthorized' })
    const payload = jwt.verify(token, JWT_SECRET)
    req.auth = payload
    return next()
  } catch {
    return res.status(401).json({ error: 'unauthorized' })
  }
}

function requireAdmin(req, res, next) {
  if (req.auth?.role !== 'ADMIN') return res.status(403).json({ error: 'forbidden' })
  return next()
}

// --- API ---
app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email_and_password_required' })

  const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } })
  if (!user) {
    await audit(req, { action: 'auth.login_failed', metadata: { email } })
    return res.status(401).json({ error: 'invalid_credentials' })
  }
  const ok = await bcrypt.compare(String(password), user.passwordHash)
  if (!ok) {
    await audit(req, { actorId: user.id, action: 'auth.login_failed' })
    return res.status(401).json({ error: 'invalid_credentials' })
  }

  const token = signSession(user)
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 12 * 60 * 60 * 1000,
  })
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
  await audit(req, { actorId: user.id, action: 'auth.login_success' })
  return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

app.post('/api/auth/logout', requireAuth, async (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' })
  await audit(req, { actorId: req.auth.sub, action: 'auth.logout' })
  return res.json({ ok: true })
})

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth.sub } })
  if (!user) return res.status(401).json({ error: 'unauthorized' })
  return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// Public bookmarks listing for authenticated users
app.get('/api/bookmarks', requireAuth, async (req, res) => {
  const { q, categoryId, sort = 'updatedAt_desc' } = req.query

  const orderBy =
    sort === 'name_asc' ? { title: 'asc' } :
    sort === 'name_desc' ? { title: 'desc' } :
    sort === 'createdAt_desc' ? { createdAt: 'desc' } :
    sort === 'createdAt_asc' ? { createdAt: 'asc' } :
    sort === 'updatedAt_asc' ? { updatedAt: 'asc' } :
    { updatedAt: 'desc' }

  const where = {
    isActive: true,
    ...(categoryId ? { categoryId: String(categoryId) } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: String(q), mode: 'insensitive' } },
            { description: { contains: String(q), mode: 'insensitive' } },
            { tags: { contains: String(q), mode: 'insensitive' } },
            { url: { contains: String(q), mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const items = await prisma.bookmark.findMany({
    where,
    orderBy,
    include: { category: true },
  })
  return res.json({ items })
})

app.get('/api/categories', requireAuth, async (_req, res) => {
  const items = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
  return res.json({ items })
})

// Admin CRUD
app.post('/api/admin/bootstrap', async (req, res) => {
  // One-time creation of first admin if no users exist yet
  const count = await prisma.user.count()
  if (count > 0) return res.status(409).json({ error: 'already_initialized' })

  const { email, password, name } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email_and_password_required' })
  const passwordHash = await bcrypt.hash(String(password), 12)
  const user = await prisma.user.create({
    data: {
      email: String(email).toLowerCase().trim(),
      name: name ? String(name).trim() : null,
      passwordHash,
      role: 'ADMIN',
    },
  })
  await audit(req, { actorId: user.id, action: 'admin.bootstrap' })
  return res.json({ ok: true })
})

app.get('/api/admin/logs', requireAuth, requireAdmin, async (req, res) => {
  const limit = Math.min(200, Math.max(1, Number(req.query.limit || 50)))
  const items = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { actor: { select: { id: true, email: true, name: true, role: true } } },
  })
  return res.json({ items })
})

// Serve built assets (Express 5 / path-to-regexp v8 rejects app.get('*', ...))
app.use(express.static(distPath))

// SPA fallback: non-file routes → index.html
app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

