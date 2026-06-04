import express from 'express'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import fs from 'fs'
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

app.use((err, req, res, next) => {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'invalid_json' })
  }
  return next(err)
})

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
            { title: { contains: String(q) } },
            { description: { contains: String(q) } },
            { tags: { contains: String(q) } },
            { url: { contains: String(q) } },
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

app.get('/api/announcements', requireAuth, async (req, res) => {
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 12)))
  const items = await prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      excerpt: true,
      tag: true,
      tagClass: true,
      publishedAt: true,
    },
  })
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

app.get('/api/admin/bookmarks', requireAuth, requireAdmin, async (_req, res) => {
  const items = await prisma.bookmark.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  })
  return res.json({ items })
})

app.post('/api/admin/bookmarks', requireAuth, requireAdmin, async (req, res) => {
  const { title, url, description, categoryId, tags, isActive } = req.body || {}
  if (!title || !url) return res.status(400).json({ error: 'title_and_url_required' })
  const item = await prisma.bookmark.create({
    data: {
      title: String(title).trim(),
      url: String(url).trim(),
      description: description ? String(description).trim() : null,
      tags: tags ? String(tags).trim() : null,
      categoryId: categoryId ? String(categoryId) : null,
      isActive: isActive !== false,
      createdById: req.auth.sub,
      updatedById: req.auth.sub,
    },
    include: { category: true },
  })
  await audit(req, { actorId: req.auth.sub, action: 'bookmark.create', entityType: 'bookmark', entityId: item.id })
  return res.status(201).json({ item })
})

app.patch('/api/admin/bookmarks/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  const existing = await prisma.bookmark.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'not_found' })
  const { title, url, description, categoryId, tags, isActive } = req.body || {}
  const item = await prisma.bookmark.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title: String(title).trim() } : {}),
      ...(url !== undefined ? { url: String(url).trim() } : {}),
      ...(description !== undefined ? { description: description ? String(description).trim() : null } : {}),
      ...(tags !== undefined ? { tags: tags ? String(tags).trim() : null } : {}),
      ...(categoryId !== undefined ? { categoryId: categoryId ? String(categoryId) : null } : {}),
      ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      updatedById: req.auth.sub,
    },
    include: { category: true },
  })
  await audit(req, { actorId: req.auth.sub, action: 'bookmark.update', entityType: 'bookmark', entityId: item.id })
  return res.json({ item })
})

app.delete('/api/admin/bookmarks/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  const existing = await prisma.bookmark.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'not_found' })
  const item = await prisma.bookmark.update({
    where: { id },
    data: { isActive: false, updatedById: req.auth.sub },
    include: { category: true },
  })
  await audit(req, { actorId: req.auth.sub, action: 'bookmark.delete', entityType: 'bookmark', entityId: item.id })
  return res.json({ item })
})

app.get('/api/admin/announcements', requireAuth, requireAdmin, async (_req, res) => {
  const items = await prisma.announcement.findMany({ orderBy: { publishedAt: 'desc' } })
  return res.json({ items })
})

app.post('/api/admin/announcements', requireAuth, requireAdmin, async (req, res) => {
  const { title, excerpt, tag, tagClass, publishedAt, isActive } = req.body || {}
  if (!title || !excerpt || !tag) return res.status(400).json({ error: 'title_excerpt_tag_required' })
  const item = await prisma.announcement.create({
    data: {
      title: String(title).trim(),
      excerpt: String(excerpt).trim(),
      tag: String(tag).trim(),
      tagClass: tagClass ? String(tagClass).trim() : 'hub-tag--green',
      isActive: isActive !== false,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      createdById: req.auth.sub,
      updatedById: req.auth.sub,
    },
  })
  await audit(req, { actorId: req.auth.sub, action: 'announcement.create', entityType: 'announcement', entityId: item.id })
  return res.status(201).json({ item })
})

app.patch('/api/admin/announcements/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  const existing = await prisma.announcement.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'not_found' })
  const { title, excerpt, tag, tagClass, publishedAt, isActive } = req.body || {}
  const item = await prisma.announcement.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title: String(title).trim() } : {}),
      ...(excerpt !== undefined ? { excerpt: String(excerpt).trim() } : {}),
      ...(tag !== undefined ? { tag: String(tag).trim() } : {}),
      ...(tagClass !== undefined ? { tagClass: String(tagClass).trim() } : {}),
      ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      ...(publishedAt !== undefined ? { publishedAt: new Date(publishedAt) } : {}),
      updatedById: req.auth.sub,
    },
  })
  await audit(req, { actorId: req.auth.sub, action: 'announcement.update', entityType: 'announcement', entityId: item.id })
  return res.json({ item })
})

app.delete('/api/admin/announcements/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  const existing = await prisma.announcement.findUnique({ where: { id } })
  if (!existing) return res.status(404).json({ error: 'not_found' })
  const item = await prisma.announcement.update({
    where: { id },
    data: { isActive: false, updatedById: req.auth.sub },
  })
  await audit(req, { actorId: req.auth.sub, action: 'announcement.delete', entityType: 'announcement', entityId: item.id })
  return res.json({ item })
})

// Serve built assets (Express 5 / path-to-regexp v8 rejects app.get('*', ...))
app.use(express.static(distPath))

// SPA fallback: non-file routes → index.html
app.use((_req, res) => {
  const indexPath = path.join(distPath, 'index.html')
  if (!fs.existsSync(indexPath)) {
    return res.status(503).type('html').send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>Octa — build required</title></head>
<body style="font-family:system-ui,sans-serif;max-width:42rem;margin:3rem auto;padding:0 1rem;line-height:1.6">
<h1>Frontend not built yet</h1>
<p>For development, run <strong>npm run dev</strong> (starts API on port 3000 and the site on port 5173).</p>
<p>For a single port, run <strong>npm run build</strong> then <strong>npm run start</strong>, then open <a href="http://localhost:${PORT}/#employees-login">http://localhost:${PORT}/#employees-login</a>.</p>
<p>Employee login (after <code>npm run seed</code>): <code>admin@octamesh.co</code> / <code>Admin123!</code></p>
</body></html>`)
  }
  return res.sendFile(indexPath)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

