export function groupBookmarksByCategory(bookmarks) {
  const byCategory = new Map();

  for (const bookmark of bookmarks) {
    const categoryName = bookmark.category?.name || 'OTHER';
    if (!byCategory.has(categoryName)) {
      byCategory.set(categoryName, []);
    }
    byCategory.get(categoryName).push(bookmark);
  }

  return [...byCategory.entries()].sort((a, b) => {
    const orderA = a[1][0]?.category?.sortOrder ?? 99;
    const orderB = b[1][0]?.category?.sortOrder ?? 99;
    return orderA - orderB;
  });
}
