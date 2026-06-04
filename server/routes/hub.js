export function registerHubRoutes(app, { prisma, requireAuth }) {
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
}
