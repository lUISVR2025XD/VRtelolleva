
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Clock, DollarSign, Package } from 'lucide-react';

const AvailableOrders = () => {
  const { user } = useAuth();
  const { orders, updateOrder, deliveryPersons, businesses } = useData();
  const { toast } = useToast();

  const deliveryPerson = deliveryPersons.find(d => d.id === user?.id);
  const availableOrders = orders.filter(order => 
    order.status === 'ready' && !order.delivery_person_id
  );

  const handleAcceptOrder = (order) => {
    if (!deliveryPerson?.is_online) {
      toast({
        title: "Debes estar en línea",
        description: "Conéctate para poder aceptar pedidos",
        variant: "destructive"
      });
      return;
    }

    updateOrder(order.id, {
      status: 'delivering',
      delivery_person_id: deliveryPerson.id,
    });

    toast({
      title: "¡Pedido aceptado!",
      description: `Has aceptado el pedido #${order.id.substring(0, 8)}`,
    });
  };

  const calculateDistance = () => {
    return (Math.random() * 5 + 1).toFixed(1);
  };

  const calculateCommission = (orderTotal) => {
    return orderTotal * 0.15;
  };

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
          Pedidos Disponibles
        </h1>
        <p className="text-white/70 text-lg">
          Encuentra pedidos cerca de ti y comienza a ganar
        </p>
      </motion.div>

      {!deliveryPerson?.is_online && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-0 border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Estás desconectado</h3>
                  <p className="text-white/70">
                    Conéctate desde tu panel principal para poder aceptar pedidos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        {availableOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-white mb-2">No hay pedidos disponibles</h3>
            <p className="text-white/70">
              Los nuevos pedidos aparecerán aquí cuando estén listos para recoger
            </p>
          </motion.div>
        ) : (
          availableOrders.map((order, index) => {
            const business = businesses.find(b => b.id === order.business_id);
            const distance = calculateDistance();
            const commission = calculateCommission(order.total_price);
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="glass-card border-0 hover:scale-[1.02] transition-transform duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">
                          Pedido #{order.id.substring(0, 8)}
                        </CardTitle>
                        <p className="text-white/70">{business?.name}</p>
                        <p className="text-white/60 text-sm">
                          {new Date(order.created_at).toLocaleString('es-ES')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Listo para recoger
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-bold">${order.total_price.toFixed(2)}</p>
                          <p className="text-green-400 text-sm">+${commission.toFixed(2)} para ti</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">{distance} km</p>
                          <p className="text-white/70 text-sm">Distancia estimada</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-white font-medium">~{Math.ceil(parseFloat(distance) * 3)} min</p>
                          <p className="text-white/70 text-sm">Tiempo estimado</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-white font-medium mb-1">📍 Recoger en:</h4>
                        <p className="text-white/70 text-sm">
                          {business?.address || 'Dirección del restaurante'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-1">🏠 Entregar en:</h4>
                        <p className="text-white/70 text-sm">
                          {order.delivery_address.address}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Productos ({order.items.length}):</h4>
                      <div className="space-y-1">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-white/70">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-white/60 text-sm">
                            +{order.items.length - 3} productos más...
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/20">
                      <Button
                        onClick={() => handleAcceptOrder(order)}
                        disabled={!deliveryPerson?.is_online}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 disabled:opacity-50"
                      >
                        {deliveryPerson?.is_online ? 'Aceptar Pedido' : 'Debes estar en línea'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AvailableOrders;
