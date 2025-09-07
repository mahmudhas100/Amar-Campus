import { Route } from 'react-router-dom';
import AdminRoute from '../components/common/AdminRoute';
import AdminDashboard from '../pages/admin/AdminDashboard';
import NoticeManager from '../pages/admin/notices/NoticeManager';
import EventManager from '../pages/admin/events/EventManager';
import VoiceBoxReports from '../pages/admin/voicebox/VoiceBoxReports';

export const adminRoutes = [
  <Route
    key="admin"
    path="/admin"
    element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    }
  />,
  <Route
    key="admin-notices"
    path="/admin/notices"
    element={
      <AdminRoute>
        <NoticeManager />
      </AdminRoute>
    }
  />,
  <Route
    key="admin-events"
    path="/admin/events"
    element={
      <AdminRoute>
        <EventManager />
      </AdminRoute>
    }
  />,
  <Route
    key="admin-voicebox"
    path="/admin/voicebox"
    element={
      <AdminRoute>
        <VoiceBoxReports />
      </AdminRoute>
    }
  />,
  // Add more admin routes as needed
];
