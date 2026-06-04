import { useCallback, useEffect, useState } from 'react';
import { FALLBACK_ANNOUNCEMENTS, FALLBACK_BOOKMARKS } from './constants.js';
import { hubApi } from './hubApi.js';

const LOGIN_ROUTE = '#employees-login';

export function useEmployeeHubData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('updatedAt_desc');
  const [bookmarks, setBookmarks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const redirectToLogin = useCallback(() => {
    window.location.hash = LOGIN_ROUTE;
  }, []);

  const loadSession = useCallback(async () => {
    try {
      const { user: sessionUser } = await hubApi.me();
      return sessionUser;
    } catch {
      redirectToLogin();
      return null;
    }
  }, [redirectToLogin]);

  const loadBookmarks = useCallback(async (query, sortKey) => {
    try {
      const data = await hubApi.bookmarks(query, sortKey);
      return data.items?.length ? data.items : FALLBACK_BOOKMARKS;
    } catch {
      return FALLBACK_BOOKMARKS;
    }
  }, []);

  const loadAnnouncements = useCallback(async () => {
    try {
      const data = await hubApi.announcements();
      return data.items?.length ? data.items : FALLBACK_ANNOUNCEMENTS;
    } catch {
      return FALLBACK_ANNOUNCEMENTS;
    }
  }, []);

  const refreshHubData = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const sessionUser = await loadSession();
      if (cancelled || !sessionUser) return;

      setUser(sessionUser);
      const [bookmarkItems, announcementItems] = await Promise.all([
        loadBookmarks('', sort),
        loadAnnouncements(),
      ]);

      if (!cancelled) {
        setBookmarks(bookmarkItems);
        setAnnouncements(announcementItems);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [loadSession, loadBookmarks, loadAnnouncements, sort, refreshKey]);

  useEffect(() => {
    if (!user) return undefined;

    const debounceId = setTimeout(async () => {
      const items = await loadBookmarks(search, sort);
      setBookmarks(items);
    }, 280);

    return () => clearTimeout(debounceId);
  }, [search, sort, user, loadBookmarks, refreshKey]);

  useEffect(() => {
    if (!user) return;
    loadAnnouncements().then(setAnnouncements);
  }, [user, loadAnnouncements, refreshKey]);

  const logout = useCallback(async () => {
    await hubApi.logout().catch(() => {});
    redirectToLogin();
  }, [redirectToLogin]);

  return {
    user,
    loading,
    search,
    setSearch,
    sort,
    setSort,
    bookmarks,
    announcements,
    refreshHubData,
    logout,
    isAdmin: user?.role === 'ADMIN',
  };
}
