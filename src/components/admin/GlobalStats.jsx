import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { BarChart3, TrendingUp, DollarSign, Users, Clock, Star } from 'lucide-react';

const GlobalStats = () => {
  const { orders, businesses, deliveryPersons, clients } = useData();

  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);
  
  const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  const stats = [
    { title: 'Ingresos Totales', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
    { title: 'Pedidos Totales', value: totalOrders, icon: BarChart3 },
    { title: 'Valor Promedio Pedido', value: `$${averageOrderValue.toFixed(2)}`, icon: TrendingUp },
    { title: 'Tasa de Finalización', value: `${completionRate.toFixed(1)}%`, icon: Star },
    { title: 'Total Clientes', value: clients.length, icon: Users },
    { title: 'Total Negocios', value: businesses.length, icon: Users },
    { title: 'Total Repartidores', value: deliveryPersons.length, icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Estadísticas Globales
        </h1>
        <p className="text-white/70 text-lg">
          Análisis detallado del rendimiento de la plataforma
        </p>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="glass-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/70">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-white/50" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GlobalStats;