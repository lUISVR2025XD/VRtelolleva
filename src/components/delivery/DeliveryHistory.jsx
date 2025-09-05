
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useData } from '@/contexts/DataContext';
import { CheckCircle, DollarSign, MapPin, Clock } from 'lucide-react';

const DeliveryHistory = () => {
  const { user } = useAuth();
  const { orders, deliveryPersons, clients } = useData();

  const deliveryPerson = deliveryPersons.find(d => d.id === user?.id);
  const completedDeliveries = orders
    .filter(order => order.delivery_person_id === deliveryPerson?.id && order.status === 'delivered')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const totalEarnings = completedDeliveries.reduce((sum, order) => sum + (order.total_price * 0.15), 0);
  const totalDeliveries = completedDeliveries.length;
  const averageEarning = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0;

  if (!deliveryPerson) {
    return <div className="text-white text-center">Cargando datos del repartidor...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Historial de Entregas
        </h1>
        <p className="text-white/70 text-lg">
          Revisa todas tus entregas completadas
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-3xl font-bold text-white">${totalEarnings.toFixed(2)}</p>
              <p className="text-white/70">Ganancias totales</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-3xl font-bold text-white">{totalDeliveries}</p>
              <p className="text-white/70">Entregas completadas</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-3xl font-bold text-white">${averageEarning.toFixed(2)}</p>
              <p className="text-white/70">Ganancia promedio</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-4">
        {completedDeliveries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-white mb-2">No tienes entregas completadas</h3>
            <p className="text-white/70">
              Tus entregas completadas aparecerán aquí
            </p>
          </motion.div>
        ) : (
          completedDeliveries.map((order, index) => {
            const client = clients.find(c => c.id === order.client_id);
            return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">
                        Pedido #{order.id.substring(0, 8)}
                      </CardTitle>
                      <p className="text-white/60 text-sm">
                        Cliente: {client?.name || 'Desconocido'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                        Entregado
                      </div>
                      <p className="text-white font-bold">${order.total_price.toFixed(2)}</p>
                      <p className="text-green-400 text-sm">
                        +${(order.total_price * 0.15).toFixed(2)} ganado
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-white/70 text-sm">Entregado en:</p>
                        <p className="text-white text-sm">
                          {order.delivery_address.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <div>
                        <p className="text-white/70 text-sm">Fecha:</p>
                        <p className="text-white text-sm">
                          {new Date(order.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/70 text-sm mb-2">
                      Productos entregados ({order.items.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item) => (
                        <span
                          key={item.id}
                          className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs"
                        >
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="bg-white/10 text-white/70 px-2 py-1 rounded text-xs">
                          +{order.items.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )})
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
