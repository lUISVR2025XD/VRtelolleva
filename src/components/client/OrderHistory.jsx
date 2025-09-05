
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Clock, MapPin, Star } from 'lucide-react';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, businesses } = useData();
  const { toast } = useToast();

  const userOrders = orders
    .filter(order => order.client_id === user?.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const getBusinessName = (businessId) => {
    const business = businesses.find(b => b.id === businessId);
    return business ? business.name : 'Negocio Desconocido';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-purple-500';
      case 'delivering': return 'bg-indigo-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'Aceptado';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo para recoger';
      case 'delivering': return 'En camino';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/cliente')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-white">Mis Pedidos</h1>
      </motion.div>

      {userOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-white mb-2">No tienes pedidos aún</h3>
          <p className="text-white/70 mb-6">
            Realiza tu primer pedido y aparecerá aquí
          </p>
          <Button
            onClick={() => navigate('/cliente')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
          >
            Explorar Restaurantes
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order, index) => (
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
                        Pedido a {getBusinessName(order.business_id)}
                      </CardTitle>
                      <p className="text-white/70 text-sm">ID: {order.id.substring(0, 8)}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </div>
                      <p className="text-white/70 text-sm mt-1">
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-white/70">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{order.delivery_address.street}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        ${order.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {(order.status === 'delivering' || order.status === 'ready') && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/seguimiento/${order.id}`)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                      >
                        Seguir pedido
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => {
                          toast({
                            title: "🚧 Esta función no está implementada aún—¡pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀"
                          });
                        }}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Calificar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => navigate(`/cliente/negocio/${order.business_id}`)}
                    >
                      Pedir de nuevo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
