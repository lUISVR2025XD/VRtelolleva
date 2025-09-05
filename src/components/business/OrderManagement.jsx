import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Clock, CheckCircle, XCircle, Truck, Package } from 'lucide-react';

const OrderManagement = () => {
  const { user } = useAuth();
  const { orders, updateOrder, businesses, clients } = useData();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const business = businesses.find(b => b.id === user?.id);
  const businessOrders = orders
    .filter(order => order.business_id === business?.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredOrders = selectedStatus === 'all' 
    ? businessOrders 
    : businessOrders.filter(order => order.status === selectedStatus);

  const statusFilters = [
    { key: 'all', label: 'Todos', count: businessOrders.length },
    { key: 'pending', label: 'Pendientes', count: businessOrders.filter(o => o.status === 'pending').length },
    { key: 'accepted', label: 'Aceptados', count: businessOrders.filter(o => o.status === 'accepted').length },
    { key: 'preparing', label: 'Preparando', count: businessOrders.filter(o => o.status === 'preparing').length },
    { key: 'ready', label: 'Listos', count: businessOrders.filter(o => o.status === 'ready').length },
  ];

  const handleStatusChange = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
    
    const statusMessages = {
      accepted: 'Pedido aceptado', preparing: 'Pedido en preparación',
      ready: 'Pedido listo para recoger', cancelled: 'Pedido cancelado'
    };

    toast({
      title: statusMessages[newStatus] || 'Estado actualizado',
      description: `El pedido #${orderId.substring(0, 8)} ha sido actualizado`,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'; case 'accepted': return 'bg-blue-500'; case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-purple-500'; case 'delivering': return 'bg-indigo-500'; case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500'; default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente'; case 'accepted': return 'Aceptado'; case 'preparing': return 'Preparando';
      case 'ready': return 'Listo para recoger'; case 'delivering': return 'En camino'; case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado'; default: return status;
    }
  };

  const getNextActions = (status) => {
    switch (status) {
      case 'pending':
        return [
          { action: 'accepted', label: 'Aceptar', icon: CheckCircle, color: 'bg-green-600' },
          { action: 'cancelled', label: 'Rechazar', icon: XCircle, color: 'bg-red-600' }
        ];
      case 'accepted': return [{ action: 'preparing', label: 'Preparar', icon: Package, color: 'bg-orange-600' }];
      case 'preparing': return [{ action: 'ready', label: 'Listo', icon: CheckCircle, color: 'bg-purple-600' }];
      default: return [];
    }
  };

  if (!business) {
    return <div className="text-white text-center">Cargando pedidos...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Gestión de Pedidos</h1>
        <p className="text-white/70 text-lg">Administra y actualiza el estado de tus pedidos</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 justify-center">
        {statusFilters.map((filter) => (
          <Button key={filter.key} variant={selectedStatus === filter.key ? "default" : "outline"} size="sm" onClick={() => setSelectedStatus(filter.key)}
            className={`${selectedStatus === filter.key ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white' : 'border-white/20 text-white hover:bg-white/10'}`}>
            {filter.label} ({filter.count})
          </Button>
        ))}
      </motion.div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-white mb-2">{selectedStatus === 'all' ? 'No hay pedidos' : `No hay pedidos ${statusFilters.find(f => f.key === selectedStatus)?.label.toLowerCase()}`}</h3>
            <p className="text-white/70">Los nuevos pedidos aparecerán aquí automáticamente</p>
          </motion.div>
        ) : (
          filteredOrders.map((order, index) => {
            const client = clients.find(c => c.id === order.client_id);
            return (
            <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
              <Card className="glass-card border-0">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">Pedido #{order.id.substring(0, 8)}</CardTitle>
                      <p className="text-white/70">{client?.name || 'Cliente desconocido'}</p>
                      <p className="text-white/60 text-sm">{new Date(order.created_at).toLocaleString('es-ES')}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</div>
                      <p className="text-white font-bold text-lg mt-1">${order.total_price.toFixed(2)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Productos:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, itemIndex) => (<div key={itemIndex} className="flex justify-between text-sm"><span className="text-white/70">{item.quantity}x {item.name}</span><span className="text-white">${(item.price * item.quantity).toFixed(2)}</span></div>))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Dirección de entrega:</h4>
                    <p className="text-white/70 text-sm">{order.delivery_address.address}</p>
                  </div>
                  {getNextActions(order.status).length > 0 && (
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      {getNextActions(order.status).map((action) => (
                        <Button key={action.action} size="sm" onClick={() => handleStatusChange(order.id, action.action)} className={`${action.color} hover:opacity-90 text-white`}>
                          <action.icon className="w-4 h-4 mr-1" />{action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  {(order.status === 'delivering' || order.status === 'delivered') && (
                    <div className="flex items-center gap-2 text-white/70 text-sm pt-2 border-t border-white/10">
                      <Truck className="w-4 h-4 text-green-400" />
                      <span>{order.status === 'delivering' ? 'En camino' : 'Entregado'} por repartidor</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )})
        )}
      </div>
    </div>
  );
};

export default OrderManagement;