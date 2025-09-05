
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe ser usado dentro de DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (table, setter) => {
    const { data, error } = await supabase.from(table).select('*');
    if (error) console.error(`Error fetching ${table}:`, error);
    else setter(data || []);
  }, []);

  const initData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchData('businesses', setBusinesses),
      fetchData('orders', setOrders),
      fetchData('products', setProducts),
      fetchData('delivery_persons', setDeliveryPersons),
      fetchData('clients', setClients),
    ]);
    setLoading(false);
  }, [fetchData]);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!user) {
      setLoading(false);
      setBusinesses([]);
      setOrders([]);
      setProducts([]);
      setDeliveryPersons([]);
      setClients([]);
      return;
    }

    initData();
  }, [user, authLoading, initData]);

  const addOrder = async (order) => {
    const { data, error } = await supabase.from('orders').insert(order).select();
    if (error) { console.error('Error adding order:', error); return null; }
    if (data && data.length > 0) {
        setOrders(prev => [...prev, data[0]]);
        return data[0];
    }
    return null;
  };

  const updateOrder = async (orderId, updates) => {
    const { data, error } = await supabase.from('orders').update(updates).eq('id', orderId).select();
    if (error) { console.error('Error updating order:', error); return; }
    setOrders(prev => prev.map(o => o.id === orderId ? data[0] : o));
  };

  const addBusiness = async (business) => {
    const { data, error } = await supabase.from('businesses').insert(business).select();
    if (error) { console.error('Error adding business:', error); return null; }
    setBusinesses(prev => [...prev, data[0]]);
    return data[0];
  };

  const updateBusiness = async (businessId, updates) => {
    const { data, error } = await supabase.from('businesses').update(updates).eq('id', businessId).select();
    if (error) { console.error('Error updating business:', error); return; }
    setBusinesses(prev => prev.map(b => b.id === businessId ? data[0] : b));
  };

  const deleteBusiness = async (businessId) => {
    const { error } = await supabase.from('businesses').delete().eq('id', businessId);
    if (error) { console.error('Error deleting business:', error); return; }
    setBusinesses(prev => prev.filter(b => b.id !== businessId));
  };

  const addProduct = async (product) => {
    const { data, error } = await supabase.from('products').insert(product).select();
    if (error) { console.error('Error adding product:', error); return null; }
    setProducts(prev => [...prev, data[0]]);
    return data[0];
  };

  const updateProduct = async (productId, updates) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', productId).select();
    if (error) { console.error('Error updating product:', error); return; }
    setProducts(prev => prev.map(p => p.id === productId ? data[0] : p));
  };

  const deleteProduct = async (productId) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) { console.error('Error deleting product:', error); return; }
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addDeliveryPerson = async (person) => {
    const { data, error } = await supabase.from('delivery_persons').insert(person).select();
    if (error) { console.error('Error adding delivery person:', error); return null; }
    setDeliveryPersons(prev => [...prev, data[0]]);
    return data[0];
  };

  const updateDeliveryPerson = async (deliveryId, updates) => {
    const { data, error } = await supabase.from('delivery_persons').update(updates).eq('id', deliveryId).select();
    if (error) { console.error('Error updating delivery person:', error); return; }
    setDeliveryPersons(prev => prev.map(p => p.id === deliveryId ? data[0] : p));
  };

  const deleteDeliveryPerson = async (deliveryId) => {
    const { error } = await supabase.from('delivery_persons').delete().eq('id', deliveryId);
    if (error) { console.error('Error deleting delivery person:', error); return; }
    setDeliveryPersons(prev => prev.filter(p => p.id !== deliveryId));
  };

  const addClient = async (client) => {
    const { data, error } = await supabase.from('clients').insert(client).select();
    if (error) { console.error('Error adding client:', error); return null; }
    setClients(prev => [...prev, data[0]]);
    return data[0];
  };

  const updateClient = async (clientId, updates) => {
    const { data, error } = await supabase.from('clients').update(updates).eq('id', clientId).select();
    if (error) { console.error('Error updating client:', error); return; }
    setClients(prev => prev.map(c => c.id === clientId ? data[0] : c));
  };

  const deleteClient = async (clientId) => {
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) { console.error('Error deleting client:', error); return; }
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const value = {
    businesses, orders, products, deliveryPersons, clients, loading,
    addOrder, updateOrder,
    addBusiness, updateBusiness, deleteBusiness,
    addProduct, updateProduct, deleteProduct,
    addDeliveryPerson, updateDeliveryPerson, deleteDeliveryPerson,
    addClient, updateClient, deleteClient
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
