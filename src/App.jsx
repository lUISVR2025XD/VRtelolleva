
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/SupabaseAuthContext';
import { DataProvider, useData } from '@/contexts/DataContext';
import HomePage from '@/pages/HomePage';
import ClientDashboard from '@/pages/ClientDashboard';
import BusinessDashboard from '@/pages/BusinessDashboard';
import DeliveryDashboard from '@/pages/DeliveryDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import OrderTracking from '@/pages/OrderTracking';
import AuthCallback from '@/pages/AuthCallback';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading: authLoading, session } = useAuth();
  const { loading: dataLoading } = useData();
  const location = useLocation();

  const loading = authLoading || (session && dataLoading);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white text-xl">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  const userRole = user.user_metadata?.role;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole) {
      return <Navigate to={`/${userRole}`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white text-xl">Cargando plataforma...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/cliente/*" element={<ProtectedRoute allowedRoles={['cliente']}><ClientDashboard /></ProtectedRoute>} />
      <Route path="/negocio/*" element={<ProtectedRoute allowedRoles={['negocio']}><BusinessDashboard /></ProtectedRoute>} />
      <Route path="/repartidor/*" element={<ProtectedRoute allowedRoles={['repartidor']}><DeliveryDashboard /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/seguimiento/:orderId" element={<ProtectedRoute allowedRoles={['cliente', 'admin']}><OrderTracking /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
            <Helmet>
              <title>VRtelolleva - Plataforma de Entregas a Domicilio</title>
              <meta name="description" content="Conecta clientes, negocios y repartidores en una plataforma integrada de entregas a domicilio" />
              <meta property="og:title" content="VRtelolleva - Plataforma de Entregas a Domicilio" />
              <meta property="og:description" content="Conecta clientes, negocios y repartidores en una plataforma integrada de entregas a domicilio" />
            </Helmet>
            <AppRoutes />
            <Toaster />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
