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
import { registerAdminRoutes } from './server/routes/admin.js'
import { registerHubRoutes } from './server/routes/hub.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

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
    req.auth = jwt.verify(token, JWT_SECRET)
    return next()
  } catch {
    return res.status(401).json({ error: 'unauthorized' })
  }
}

function requireAdmin(req, res, next) {
  if (req.auth?.role !== 'ADMIN') return res.status(403).json({ error: 'forbidden' })
  return next()
}

const routeDeps = { prisma, requireAuth, requireAdmin, audit }

// --- Health & auth ---
app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email_and_password_required' })

  const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } })
  if (!user) {
    await audit(req, { action: 'auth.login_failed', metadata: { email } })
    return res.status(401).json({ error: 'invalid_credentials' })
  }

  const passwordOk = await bcrypt.compare(String(password), user.passwordHash)
  if (!passwordOk) {
    await audit(req, { actorId: user.id, action: 'auth.login_failed' })
    return res.status(401).json({ error: 'invalid_credentials' })
  }

  res.cookie(COOKIE_NAME, signSession(user), {
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

registerHubRoutes(app, routeDeps)
registerAdminRoutes(app, routeDeps)

app.use(express.static(distPath))

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
