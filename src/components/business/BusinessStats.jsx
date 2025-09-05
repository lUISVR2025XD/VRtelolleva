import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useData } from '@/contexts/DataContext';
import { BarChart3, TrendingUp, DollarSign, Users, Clock, Star } from 'lucide-react';

const BusinessStats = () => {
  const { user } = useAuth();
  const { orders, businesses, clients } = useData();

  const business = businesses.find(b => b.id === user?.id);
  const businessOrders = orders.filter(order => order.business_id === business?.id);

  if (!business) {
    return <div className="text-white text-center">Cargando estadísticas...</div>;
  }

  const totalOrders = businessOrders.length;
  const completedOrders = businessOrders.filter(order => order.status === 'delivered').length;
  const totalRevenue = businessOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total_price, 0);
  
  const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  const ordersByStatus = {
    pending: businessOrders.filter(o => o.status === 'pending').length,
    accepted: businessOrders.filter(o => o.status === 'accepted').length,
    preparing: businessOrders.filter(o => o.status === 'preparing').length,
    ready: businessOrders.filter(o => o.status === 'ready').length,
    delivering: businessOrders.filter(o => o.status === 'delivering').length,
    delivered: businessOrders.filter(o => o.status === 'delivered').length,
    cancelled: businessOrders.filter(o => o.status === 'cancelled').length,
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  }).reverse();

  const dailyStats = last7Days.map(date => {
    const dayOrders = businessOrders.filter(order => 
      new Date(order.created_at).toDateString() === date
    );
    const dayRevenue = dayOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total_price, 0);
    
    return {
      date: new Date(date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      orders: dayOrders.length,
      revenue: dayRevenue
    };
  });

  const stats = [
    {
      title: 'Ingresos Totales',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      change: '+15.3%'
    },
    {
      title: 'Pedidos Totales',
      value: totalOrders,
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-600',
      change: `${completedOrders} completados`
    },
    {
      title: 'Valor Promedio',
      value: `$${averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-600',
      change: 'Por pedido'
    },
    {
      title: 'Tasa de Finalización',
      value: `${completionRate.toFixed(1)}%`,
      icon: Users,
      color: 'from-orange-500 to-amber-600',
      change: 'Pedidos completados'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Estadísticas y Reportes
        </h1>
        <p className="text-white/70 text-lg">
          Analiza el rendimiento de tu restaurante
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="glass-card border-0 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                    <p className="text-white/60 text-sm mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white">Rendimiento Diario (Últimos 7 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyStats.map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">{day.date}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white font-medium">{day.orders} pedidos</p>
                        <p className="text-white/60 text-sm">${day.revenue.toFixed(2)}</p>
                      </div>
                      <div className="w-20 bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full"
                          style={{ width: `${Math.min((day.orders / (Math.max(...dailyStats.map(d => d.orders)) || 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white">Distribución de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(ordersByStatus).map(([status, count]) => {
                  const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                  const statusLabels = {
                    pending: 'Pendientes', accepted: 'Aceptados', preparing: 'Preparando',
                    ready: 'Listos', delivering: 'En camino', delivered: 'Entregados', cancelled: 'Cancelados'
                  };
                  const statusColors = {
                    pending: 'from-yellow-500 to-amber-500', accepted: 'from-blue-500 to-cyan-500', preparing: 'from-orange-500 to-red-500',
                    ready: 'from-purple-500 to-violet-500', delivering: 'from-indigo-500 to-blue-500', delivered: 'from-green-500 to-emerald-500', cancelled: 'from-red-500 to-pink-500'
                  };
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">{statusLabels[status]}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{count}</span>
                        <div className="w-20 bg-white/20 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${statusColors[status]} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-white/60 text-sm w-12 text-right">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white">Rendimiento del Negocio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2"><Star className="w-8 h-8 text-yellow-400" /></div>
                <p className="text-2xl font-bold text-white">{business?.rating}</p>
                <p className="text-white/70 text-sm">Calificación</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2"><Clock className="w-8 h-8 text-blue-400" /></div>
                <p className="text-2xl font-bold text-white">{business?.delivery_time}</p>
                <p className="text-white/70 text-sm">Tiempo promedio</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2"><TrendingUp className="w-8 h-8 text-green-400" /></div>
                <p className="text-2xl font-bold text-white">{completionRate.toFixed(1)}%</p>
                <p className="text-white/70 text-sm">Tasa de éxito</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2"><Users className="w-8 h-8 text-purple-400" /></div>
                <p className="text-2xl font-bold text-white">{new Set(businessOrders.map(o => o.client_id)).size}</p>
                <p className="text-white/70 text-sm">Clientes únicos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BusinessStats;