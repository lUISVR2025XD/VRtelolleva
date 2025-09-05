
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { Search, Star, Clock, MapPin, FileText } from 'lucide-react';

const BusinessList = () => {
  const { businesses } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Comida Rápida', 'Hamburguesas', 'Japonesa', 'Pizza', 'Mexicana'];

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (business.category && business.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          ¿Qué te apetece hoy?
        </h1>
        <p className="text-white/70 text-lg">
          Descubre los mejores restaurantes cerca de ti
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <Input
              placeholder="Buscar restaurantes o comida..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business, index) => (
          <motion.div
            key={business.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="glass-card border-0 overflow-hidden hover:scale-105 transition-all duration-300 group">
              <Link to={`/cliente/negocio/${business.id}`}>
                <div className="relative">
                  <img  alt={business.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" src="https://images.unsplash.com/photo-1644981900009-e54566bb4c34" />
                  <div className="absolute top-4 right-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${business.is_open ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {business.is_open ? 'Abierto' : 'Cerrado'}
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {business.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{business.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/70 mb-4">{business.category}</p>
                  
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{business.delivery_time}</span></div>
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>${business.delivery_fee} envío</span></div>
                  </div>
                </CardContent>
              </Link>
              {business.promotions && business.promotions.length > 0 && (
                <div className="p-4 pt-0">
                  <a href={business.promotions[0].url} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Menú / Promociones
                    </Button>
                  </a>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">No se encontraron resultados</h3>
          <p className="text-white/70">Intenta con otros términos de búsqueda o categorías</p>
        </motion.div>
      )}
    </div>
  );
};

export default BusinessList;
