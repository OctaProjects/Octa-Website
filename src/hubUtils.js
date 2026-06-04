export function formatTimeAgo(dateInput) {
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return '';
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hour${sec < 7200 ? '' : 's'} ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)} day${sec < 172800 ? '' : 's'} ago`;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

export const ANNOUNCEMENT_TAG_PRESETS = [
  { tag: 'System Update', tagClass: 'hub-tag--green' },
  { tag: 'Company News', tagClass: 'hub-tag--blue' },
  { tag: 'Security', tagClass: 'hub-tag--orange' },
  { tag: 'General', tagClass: 'hub-tag--green' },
];
