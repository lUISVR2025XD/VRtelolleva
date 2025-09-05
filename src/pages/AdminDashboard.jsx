import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import GlobalStats from '@/components/admin/GlobalStats';
import RealtimeMap from '@/components/admin/RealtimeMap';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/usuarios" element={<UserManagement />} />
        <Route path="/estadisticas" element={<GlobalStats />} />
        <Route path="/mapa" element={<RealtimeMap />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;