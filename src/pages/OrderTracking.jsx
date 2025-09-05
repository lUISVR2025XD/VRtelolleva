import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import DeliveryMap from '@/components/maps/DeliveryMap';
import { ArrowLeft, Clock, MapPin, Phone, Star } from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, deliveryPersons } = useData();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  const order = orders.find(o => o.id === orderId);
  const deliveryPerson = order?.deliveryPersonId 
    ? deliveryPersons.find(d => d.id === order.deliveryPersonId)
    : null;

  useEffect(() => {
    if (!order) {
      toast({
        title: "Pedido no encontrado",
        description: "El pedido que buscas no existe",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [order, navigate, toast]);

  if (!order) {
    return null;
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          title: 'Pedido Recibido',
          description: 'Tu pedido ha sido enviado al restaurante',
          color: 'text-yellow-400',
          progress: 20
        };
      case 'accepted':
        return {
          title: 'Pedido Aceptado',
          description: 'El restaurante ha confirmado tu pedido',
          color: 'text-blue-400',
          progress: 40
        };
      case 'preparing':
        return {
          title: 'Preparando tu Pedido',
          description: 'El restaurante está preparando tu comida',
          color: 'text-orange-400',
          progress: 60
        };
      case 'ready':
        return {
          title: 'Pedido Listo',
          description: 'Tu pedido está listo para ser recogido',
          color: 'text-purple-400',
          progress: 70
        };
      case 'delivering':
        return {
          title: 'En Camino',
          description: 'Tu pedido está siendo entregado',
          color: 'text-indigo-400',
          progress: 90
        };
      case 'delivered':
        return {
          title: 'Entregado',
          description: '¡Tu pedido ha sido entregado exitosamente!',
          color: 'text-green-400',
          progress: 100
        };
      default:
        return {
          title: 'Estado Desconocido',
          description: '',
          color: 'text-gray-400',
          progress: 0
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  const handleRating = (stars) => {
    setRating(stars);
    toast({
      title: "¡Gracias por tu calificación!",
      description: `Has calificado con ${stars} estrellas`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">
            Seguimiento del Pedido #{order.id}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Current Status */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className={`text-2xl ${statusInfo.color}`}>
                  {statusInfo.title}
                </CardTitle>
                <p className="text-white/70">{statusInfo.description}</p>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${statusInfo.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  />
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="w-4 h-4" />
                  <span>Tiempo estimado: {order.estimatedTime}</span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Person Info */}
            {deliveryPerson && order.status === 'delivering' && (
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-white">Tu Repartidor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {deliveryPerson.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{deliveryPerson.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white/70 text-sm">{deliveryPerson.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <span>🏍️ {deliveryPerson.vehicle}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => {
                      toast({
                        title: "🚧 Esta función no está implementada aún—¡pero no te preocupes! Puedes solicitarla en tu próximo prompt! 🚀"
                      });
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contactar
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Order Details */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white">Detalles del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-white font-medium">{order.businessName}</p>
                  <p className="text-white/70 text-sm">
                    {new Date(order.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/70">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between font-bold text-white">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            {order.status === 'delivered' && (
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-white">Califica tu experiencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`text-2xl transition-colors ${
                          star <= rating ? 'text-yellow-400' : 'text-white/30'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-center text-white/70 text-sm">
                      ¡Gracias por tu calificación de {rating} estrellas!
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-0 h-[600px]">
              <CardContent className="p-0 h-full">
                <DeliveryMap
                  order={order}
                  deliveryPerson={deliveryPerson}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;