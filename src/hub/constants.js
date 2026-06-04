export const HUB_SORT_OPTIONS = [
  { value: 'updatedAt_desc', label: 'Recently updated' },
  { value: 'name_asc', label: 'Name (A–Z)' },
  { value: 'name_desc', label: 'Name (Z–A)' },
  { value: 'createdAt_desc', label: 'Newest' },
];

export const ADMIN_TABS = [
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'categories', label: 'Categories' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'users', label: 'Users' },
  { id: 'logs', label: 'Audit logs' },
];

export const USER_ROLES = [
  { value: 'USER', label: 'Employee' },
  { value: 'ADMIN', label: 'Administrator' },
];

export const ANNOUNCEMENT_TAG_PRESETS = [
  { tag: 'System Update', tagClass: 'hub-tag--green' },
  { tag: 'Company News', tagClass: 'hub-tag--blue' },
  { tag: 'Security', tagClass: 'hub-tag--orange' },
  { tag: 'General', tagClass: 'hub-tag--green' },
];

export const EMPTY_BOOKMARK_FORM = {
  title: '',
  url: '',
  description: '',
  categoryId: '',
  isActive: true,
};

export const EMPTY_CATEGORY_FORM = {
  name: '',
  sortOrder: 0,
};

export const EMPTY_ANNOUNCEMENT_FORM = {
  title: '',
  excerpt: '',
  tag: 'System Update',
  tagClass: 'hub-tag--green',
  isActive: true,
};

export const EMPTY_USER_FORM = {
  email: '',
  password: '',
  name: '',
  role: 'USER',
};

export const FALLBACK_ANNOUNCEMENTS = [
  {
    id: '1',
    tag: 'System Update',
    tagClass: 'hub-tag--green',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    title: 'Planned Maintenance: VDI Environments',
    excerpt: 'Scheduled maintenance for virtual desktop infrastructure will occur tonight from 11 PM to 2 AM. Please save your work.',
  },
  {
    id: '2',
    tag: 'Company News',
    tagClass: 'hub-tag--blue',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    title: 'Q3 Townhall Recording Available',
    excerpt: 'The recording of the quarterly townhall meeting is now available on the internal portal for all employees.',
  },
  {
    id: '3',
    tag: 'Security',
    tagClass: 'hub-tag--orange',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    title: 'Mandatory Security Training',
    excerpt: 'All employees must complete the annual security awareness training module by the end of this month.',
  },
];

export const FALLBACK_BOOKMARKS = [
  { id: 'z1', title: 'Zoho Mail', description: 'Corporate email access', url: 'https://mail.zoho.com', category: { name: 'ZOHO SUITE', sortOrder: 0 } },
  { id: 'z2', title: 'Zoho Desk', description: 'IT support ticketing', url: 'https://desk.zoho.com', category: { name: 'ZOHO SUITE', sortOrder: 0 } },
  { id: 'z3', title: 'Zoho Assist', description: 'Remote support sessions', url: 'https://assist.zoho.com', category: { name: 'ZOHO SUITE', sortOrder: 0 } },
  { id: 'c1', title: 'Atlassian', description: 'Knowledge base & wiki', url: 'https://www.atlassian.com', category: { name: 'CONFLUENCE', sortOrder: 1 } },
  { id: 'm1', title: 'Admin Center', description: 'User management portal', url: 'https://admin.microsoft.com', category: { name: 'MICROSOFT SUITE', sortOrder: 2 } },
  { id: 'm2', title: 'Azure Portal', description: 'Cloud infrastructure', url: 'https://portal.azure.com', category: { name: 'MICROSOFT SUITE', sortOrder: 2 } },
  { id: 'm3', title: 'VDI Access', description: 'Virtual desktop login', url: 'https://portal.azure.com', category: { name: 'MICROSOFT SUITE', sortOrder: 2 } },
];
