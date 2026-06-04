import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../hubApi.js';

const EMPTY_DATA = {
  bookmarks: [],
  announcements: [],
  categories: [],
  users: [],
  logs: [],
};

export function useAdminPanel(onDataChange) {
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(EMPTY_DATA);

  const reload = useCallback(async () => {
    const [bookmarks, announcements, categories, users, logs] = await Promise.all([
      adminApi.bookmarks.list(),
      adminApi.announcements.list(),
      adminApi.categories.list(),
      adminApi.users.list(),
      adminApi.logs(),
    ]);

    setData({
      bookmarks: bookmarks.items || [],
      announcements: announcements.items || [],
      categories: categories.items || [],
      users: users.items || [],
      logs: logs.items || [],
    });
  }, []);

  useEffect(() => {
    reload().catch(() => setError('Could not load admin data.'));
  }, [reload]);

  const runAction = useCallback(async (action) => {
    setError('');
    setBusy(true);
    try {
      await action();
      await reload();
      onDataChange?.();
    } catch (err) {
      setError(err.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  }, [reload, onDataChange]);

  return {
    activeTab,
    setActiveTab,
    busy,
    error,
    data,
    runAction,
    setError,
  };
}
