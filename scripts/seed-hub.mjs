/**
 * Seed demo admin user + bookmark categories/resources.
 * Run: node scripts/seed-hub.mjs
 */
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../src/generated/prisma/client.ts'

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@octamesh.co'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin123!'
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || '7amo'

const CATEGORIES = [
  { name: 'ZOHO SUITE', sortOrder: 0, bookmarks: [
    { title: 'Zoho Mail', description: 'Corporate email access', url: 'https://mail.zoho.com' },
    { title: 'Zoho Desk', description: 'IT support ticketing', url: 'https://desk.zoho.com' },
    { title: 'Zoho Assist', description: 'Remote support sessions', url: 'https://assist.zoho.com' },
  ]},
  { name: 'CONFLUENCE', sortOrder: 1, bookmarks: [
    { title: 'Atlassian', description: 'Knowledge base & wiki', url: 'https://www.atlassian.com' },
  ]},
  { name: 'MICROSOFT SUITE', sortOrder: 2, bookmarks: [
    { title: 'Admin Center', description: 'User management portal', url: 'https://admin.microsoft.com' },
    { title: 'Azure Portal', description: 'Cloud infrastructure', url: 'https://portal.azure.com' },
    { title: 'VDI Access', description: 'Virtual desktop login', url: 'https://portal.azure.com' },
  ]},
]

const ANNOUNCEMENTS = [
  {
    title: 'Planned Maintenance: VDI Environments',
    excerpt: 'Scheduled maintenance for virtual desktop infrastructure will occur tonight from 11 PM to 2 AM. Please save your work.',
    tag: 'System Update',
    tagClass: 'hub-tag--green',
    hoursAgo: 2,
  },
  {
    title: 'Q3 Townhall Recording Available',
    excerpt: 'The recording of the quarterly townhall meeting is now available on the internal portal for all employees.',
    tag: 'Company News',
    tagClass: 'hub-tag--blue',
    hoursAgo: 24,
  },
  {
    title: 'Mandatory Security Training',
    excerpt: 'All employees must complete the annual security awareness training module by the end of this month.',
    tag: 'Security',
    tagClass: 'hub-tag--orange',
    hoursAgo: 24 * 14,
  },
]

async function main() {
  let user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
  if (!user) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)
    user = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        passwordHash,
        role: 'ADMIN',
      },
    })
    console.log(`Created admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  } else {
    console.log(`Admin exists: ${ADMIN_EMAIL}`)
  }

  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      create: { name: cat.name, sortOrder: cat.sortOrder },
      update: { sortOrder: cat.sortOrder },
    })
    for (const b of cat.bookmarks) {
      const existing = await prisma.bookmark.findFirst({
        where: { title: b.title, categoryId: category.id },
      })
      if (existing) {
        await prisma.bookmark.update({
          where: { id: existing.id },
          data: {
            url: b.url,
            description: b.description,
            updatedById: user.id,
          },
        })
        continue
      }
      await prisma.bookmark.create({
        data: {
          title: b.title,
          description: b.description,
          url: b.url,
          categoryId: category.id,
          createdById: user.id,
          updatedById: user.id,
        },
      })
    }
  }

  for (const a of ANNOUNCEMENTS) {
    const existing = await prisma.announcement.findFirst({ where: { title: a.title } })
    const publishedAt = new Date(Date.now() - a.hoursAgo * 60 * 60 * 1000)
    if (existing) {
      await prisma.announcement.update({
        where: { id: existing.id },
        data: {
          excerpt: a.excerpt,
          tag: a.tag,
          tagClass: a.tagClass,
          publishedAt,
          isActive: true,
          updatedById: user.id,
        },
      })
      continue
    }
    await prisma.announcement.create({
      data: {
        title: a.title,
        excerpt: a.excerpt,
        tag: a.tag,
        tagClass: a.tagClass,
        publishedAt,
        createdById: user.id,
        updatedById: user.id,
      },
    })
  }

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
