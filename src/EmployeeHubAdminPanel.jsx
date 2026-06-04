import { ADMIN_TABS } from './hub/constants.js';
import AdminAnnouncementsTab from './hub/admin/AdminAnnouncementsTab.jsx';
import AdminBookmarksTab from './hub/admin/AdminBookmarksTab.jsx';
import AdminCategoriesTab from './hub/admin/AdminCategoriesTab.jsx';
import AdminLogsTab from './hub/admin/AdminLogsTab.jsx';
import AdminUsersTab from './hub/admin/AdminUsersTab.jsx';
import { AdminError, AdminTabs } from './hub/admin/AdminUi.jsx';
import { useAdminPanel } from './hub/admin/useAdminPanel.js';

export default function EmployeeHubAdminPanel({ currentUserId, onDataChange }) {
  const { activeTab, setActiveTab, busy, error, data, runAction } = useAdminPanel(onDataChange);

  return (
    <section className="hub-section hub-admin">
      <div className="hub-section-head">
        <h2 className="hub-section-title">Administration</h2>
      </div>

      <AdminTabs tabs={ADMIN_TABS} activeTab={activeTab} onChange={setActiveTab} />
      <AdminError message={error} />

      {activeTab === 'bookmarks' && (
        <AdminBookmarksTab
          bookmarks={data.bookmarks}
          categories={data.categories}
          busy={busy}
          runAction={runAction}
        />
      )}

      {activeTab === 'categories' && (
        <AdminCategoriesTab
          categories={data.categories}
          busy={busy}
          runAction={runAction}
        />
      )}

      {activeTab === 'announcements' && (
        <AdminAnnouncementsTab
          announcements={data.announcements}
          busy={busy}
          runAction={runAction}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsersTab
          users={data.users}
          currentUserId={currentUserId}
          busy={busy}
          runAction={runAction}
        />
      )}

      {activeTab === 'logs' && <AdminLogsTab logs={data.logs} />}
    </section>
  );
}
