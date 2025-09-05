import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Plus, Minus, Trash2, MapPin, CreditCard } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addOrder, businesses } = useData();
  const { toast } = useToast();
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('deliveryApp_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
      const savedAddress = localStorage.getItem('deliveryApp_lastAddress');
      return savedAddress || '';
  });

  useEffect(() => {
    localStorage.setItem('deliveryApp_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  }, [cart]);

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  const updateQuantity = (productId, change) => {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean);
    
    updateCart(newCart);
  };

  const removeItem = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    updateCart(newCart);
    toast({
      title: "Producto eliminado",
      description: "El producto se eliminó del carrito",
    });
  };

  const clearCart = () => {
    updateCart([]);
    toast({
      title: "Carrito vaciado",
      description: "Se eliminaron todos los productos del carrito",
    });
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: "Dirección requerida",
        description: "Por favor, ingresa tu dirección de entrega.",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
        toast({
            title: "Carrito vacío",
            description: "No puedes realizar un pedido con el carrito vacío.",
            variant: "destructive"
        });
        return;
    }

    const orderData = {
      client_id: user.id,
      business_id: cart[0].businessId,
      items: cart,
      total_price: finalTotal,
      delivery_address: { address: deliveryAddress },
      status: 'pending',
    };

    const newOrder = await addOrder(orderData);
    if (newOrder) {
      localStorage.setItem('deliveryApp_lastAddress', deliveryAddress);
      updateCart([]);
      toast({
        title: "¡Pedido realizado!",
        description: `Tu pedido ha sido enviado al restaurante.`,
      });
      navigate(`/cliente/pedidos`);
    } else {
      toast({
        title: "Error al realizar el pedido",
        description: "Hubo un problema al procesar tu pedido. Verifica tus datos e inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  if (cart.length === 0) {
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
          <h1 className="text-3xl font-bold text-white">Carrito de Compras</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h3>
          <p className="text-white/70 mb-6">
            Agrega algunos productos deliciosos para comenzar
          </p>
          <Button
            onClick={() => navigate('/cliente')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
          >
            Explorar Restaurantes
          </Button>
        </motion.div>
      </div>
    );
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const business = businesses.find(b => b.id === cart[0]?.businessId);
  const deliveryFee = business?.delivery_fee || 0;
  const finalTotal = cartTotal + deliveryFee;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/cliente')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Carrito de Compras</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Vaciar carrito
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white">
                  Pedido de {cart[0]?.businessName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                  >
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                     src="https://images.unsplash.com/photo-1690809080506-820f12d90f11" />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <p className="text-white/60 text-sm">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 p-0 border-white/20 text-white hover:bg-white/10"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-white font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 p-0 border-white/20 text-white hover:bg-white/10"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-white font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Dirección de Entrega
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="full_address" className="text-white">Domicilio completo (calle, número, colonia, etc.)</Label>
                    <Input
                      id="full_address"
                      placeholder="Ej: Av. Siempre Viva 742, Springfield"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Envío</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-white/60">
                  <p>• Tiempo estimado: {business?.delivery_time}</p>
                  <p>• Pago contra entrega</p>
                  <p>• Seguimiento en tiempo real</p>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 text-lg py-6"
                  disabled={!deliveryAddress.trim()}
                >
                  Realizar Pedido
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;