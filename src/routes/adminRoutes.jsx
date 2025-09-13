import { Route } from 'react-router-dom';
import AdminRoute from '../components/common/AdminRoute';
import AdminDashboard from '../pages/admin/AdminDashboard';
import NoticeManager from '../pages/admin/notices/NoticeManager';
import EventManager from '../pages/admin/events/EventManager';
import VoiceBoxReports from '../pages/admin/voicebox/VoiceBoxReports';
import AdminLayout from '../components/layout/AdminLayout';

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route
      index
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />
    <Route
      path="notices"
      element={
        <AdminRoute>
          <NoticeManager />
        </AdminRoute>
      }
    />
    <Route
      path="events"
      element={
        <AdminRoute>
          <EventManager />
        </AdminRoute>
      }
    />
    <Route
      path="voicebox"
      element={
        <AdminRoute>
          <VoiceBoxReports />
        </AdminRoute>
      }
    />
  </Route>
);
