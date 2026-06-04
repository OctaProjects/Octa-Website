import bcrypt from 'bcryptjs'

const userPublicSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  lastLoginAt: true,
  createdAt: true,
}

export function registerAdminRoutes(app, { prisma, requireAuth, requireAdmin, audit }) {
  app.post('/api/admin/bootstrap', async (req, res) => {
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
      include: { actor: { select: userPublicSelect } },
    })
    return res.json({ items })
  })

  app.get('/api/admin/users', requireAuth, requireAdmin, async (_req, res) => {
    const items = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: userPublicSelect,
    })
    return res.json({ items })
  })

  app.post('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
    const { email, password, name, role } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email_and_password_required' })

    const normalizedEmail = String(email).toLowerCase().trim()
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) return res.status(409).json({ error: 'email_already_exists' })

    const passwordHash = await bcrypt.hash(String(password), 12)
    const item = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name ? String(name).trim() : null,
        passwordHash,
        role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      },
      select: userPublicSelect,
    })
    await audit(req, { actorId: req.auth.sub, action: 'user.create', entityType: 'user', entityId: item.id })
    return res.status(201).json({ item })
  })

  app.patch('/api/admin/users/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'not_found' })

    const { name, role } = req.body || {}
    if (id === req.auth.sub && role && role !== 'ADMIN') {
      return res.status(400).json({ error: 'cannot_change_own_role' })
    }

    const item = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: name ? String(name).trim() : null } : {}),
        ...(role !== undefined ? { role: role === 'ADMIN' ? 'ADMIN' : 'USER' } : {}),
      },
      select: userPublicSelect,
    })
    await audit(req, { actorId: req.auth.sub, action: 'user.update', entityType: 'user', entityId: item.id })
    return res.json({ item })
  })

  app.get('/api/admin/categories', requireAuth, requireAdmin, async (_req, res) => {
    const items = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
    return res.json({ items })
  })

  app.post('/api/admin/categories', requireAuth, requireAdmin, async (req, res) => {
    const { name, sortOrder } = req.body || {}
    if (!name) return res.status(400).json({ error: 'name_required' })

    const item = await prisma.category.create({
      data: {
        name: String(name).trim(),
        sortOrder: Number(sortOrder) || 0,
      },
    })
    await audit(req, { actorId: req.auth.sub, action: 'category.create', entityType: 'category', entityId: item.id })
    return res.status(201).json({ item })
  })

  app.patch('/api/admin/categories/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'not_found' })

    const { name, sortOrder } = req.body || {}
    const item = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: String(name).trim() } : {}),
        ...(sortOrder !== undefined ? { sortOrder: Number(sortOrder) || 0 } : {}),
      },
    })
    await audit(req, { actorId: req.auth.sub, action: 'category.update', entityType: 'category', entityId: item.id })
    return res.json({ item })
  })

  app.delete('/api/admin/categories/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: 'not_found' })

    const bookmarkCount = await prisma.bookmark.count({ where: { categoryId: id } })
    if (bookmarkCount > 0) return res.status(409).json({ error: 'category_has_bookmarks' })

    await prisma.category.delete({ where: { id } })
    await audit(req, { actorId: req.auth.sub, action: 'category.delete', entityType: 'category', entityId: id })
    return res.json({ ok: true })
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
}
