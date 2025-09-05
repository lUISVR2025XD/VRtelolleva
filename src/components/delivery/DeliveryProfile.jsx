
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Save, User, Phone, Truck, Star, DollarSign } from 'lucide-react';

const DeliveryProfile = () => {
  const { user } = useAuth();
  const { deliveryPersons, updateDeliveryPerson } = useData();
  const { toast } = useToast();
  
  const deliveryPerson = deliveryPersons.find(d => d.id === user?.id);
  
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    vehicle: ''
  });

  useEffect(() => {
    if (deliveryPerson) {
      setProfile({
        name: deliveryPerson.name || '',
        phone: deliveryPerson.phone || '',
        vehicle: deliveryPerson.vehicle || ''
      });
    }
  }, [deliveryPerson]);

  const handleSave = () => {
    if (!deliveryPerson) return;
    updateDeliveryPerson(deliveryPerson.id, {
      name: profile.name,
      phone: profile.phone,
      vehicle: profile.vehicle
    });
    
    toast({
      title: "Perfil actualizado",
      description: "Tus datos se han guardado correctamente",
    });
  };

  if (!deliveryPerson) {
    return <div className="text-white text-center">Cargando datos del repartidor...</div>;
  }

  const userName = user?.user_metadata?.name || user?.email;
  const userAvatar = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${userName}&background=random`;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Mi Perfil de Repartidor
        </h1>
        <p className="text-white/70 text-lg">
          Administra tu información personal y estadísticas
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">Nombre completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">Teléfono</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+52 123 456 7890"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="vehicle" className="text-white">Vehículo</Label>
                <Input
                  id="vehicle"
                  value={profile.vehicle}
                  onChange={(e) => setProfile({ ...profile, vehicle: e.target.value })}
                  placeholder="Ej: Motocicleta, Bicicleta, Auto"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <img
                src={userAvatar}
                alt={userName}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-white mb-2">{profile.name}</h3>
              <p className="text-white/70 mb-4">Repartidor</p>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-bold">{deliveryPerson?.rating}</span>
                <span className="text-white/70">calificación</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  deliveryPerson?.is_online ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-white/70">
                  {deliveryPerson?.is_online ? 'En línea' : 'Desconectado'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span className="text-white/70">Entregas totales</span>
                </div>
                <span className="text-white font-bold">
                  {deliveryPerson?.total_deliveries || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white/70">Ganancias totales</span>
                </div>
                <span className="text-white font-bold">
                  ${(deliveryPerson?.earnings || 0).toFixed(2)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/70">Calificación</span>
                </div>
                <span className="text-white font-bold">
                  {deliveryPerson?.rating}/5.0
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-400" />
                  <span className="text-white/70">Vehículo</span>
                </div>
                <span className="text-white font-bold">
                  {deliveryPerson?.vehicle || 'No especificado'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-white text-lg">Rendimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  ${((deliveryPerson?.earnings || 0) / Math.max(deliveryPerson?.total_deliveries || 1, 1)).toFixed(2)}
                </p>
                <p className="text-white/70 text-sm">Ganancia promedio por entrega</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {deliveryPerson?.total_deliveries || 0}
                </p>
                <p className="text-white/70 text-sm">Entregas este mes</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DeliveryProfile;
