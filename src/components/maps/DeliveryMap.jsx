import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useData } from '@/contexts/DataContext';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const businessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const clientIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DeliveryMap = ({ order, deliveryPerson }) => {
  const { businesses } = useData();
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const business = businesses.find(b => b.id === order.businessId);
  const clientLocation = order.deliveryAddress.coordinates;

  useEffect(() => {
    // Simulate delivery person movement
    if (deliveryPerson && order.status === 'delivering') {
      const interval = setInterval(() => {
        // Simulate movement towards client
        setDeliveryLocation(prev => {
          if (!prev) return deliveryPerson.currentLocation;
          
          const targetLat = clientLocation.lat;
          const targetLng = clientLocation.lng;
          const currentLat = prev.lat;
          const currentLng = prev.lng;
          
          // Move 10% closer to target each update
          const newLat = currentLat + (targetLat - currentLat) * 0.1;
          const newLng = currentLng + (targetLng - currentLng) * 0.1;
          
          return { lat: newLat, lng: newLng };
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [deliveryPerson, order.status, clientLocation]);

  const center = business?.location || clientLocation;
  const currentDeliveryLocation = deliveryLocation || deliveryPerson?.currentLocation;

  // Create route line if delivery person is active
  const routePositions = [];
  if (business?.location) {
    routePositions.push([business.location.lat, business.location.lng]);
  }
  if (currentDeliveryLocation && order.status === 'delivering') {
    routePositions.push([currentDeliveryLocation.lat, currentDeliveryLocation.lng]);
  }
  if (clientLocation) {
    // The route should go from business to delivery person to client
    const fullRoute = [];
    if (business?.location) fullRoute.push([business.location.lat, business.location.lng]);
    if (currentDeliveryLocation && order.status === 'delivering') fullRoute.push([currentDeliveryLocation.lat, currentDeliveryLocation.lng]);
    fullRoute.push([clientLocation.lat, clientLocation.lng]);
  }

  const polylinePositions = [];
    if(business?.location) polylinePositions.push([business.location.lat, business.location.lng]);
    if(currentDeliveryLocation && order.status === 'delivering') polylinePositions.push([currentDeliveryLocation.lat, currentDeliveryLocation.lng]);
    if(clientLocation) polylinePositions.push([clientLocation.lat, clientLocation.lng]);


  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Business Marker */}
      {business?.location && (
        <Marker 
          position={[business.location.lat, business.location.lng]} 
          icon={businessIcon}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold">{business.name}</h3>
              <p className="text-sm text-gray-600">Restaurante</p>
              <p className="text-sm">{business.address}</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Delivery Person Marker */}
      {currentDeliveryLocation && order.status === 'delivering' && (
        <Marker 
          position={[currentDeliveryLocation.lat, currentDeliveryLocation.lng]} 
          icon={deliveryIcon}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold">{deliveryPerson?.name}</h3>
              <p className="text-sm text-gray-600">Repartidor</p>
              <p className="text-sm">⭐ {deliveryPerson?.rating}</p>
              <p className="text-sm">🏍️ {deliveryPerson?.vehicle}</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Client Marker */}
      <Marker 
        position={[clientLocation.lat, clientLocation.lng]} 
        icon={clientIcon}
      >
        <Popup>
          <div className="text-center">
            <h3 className="font-bold">Destino</h3>
            <p className="text-sm text-gray-600">Dirección de entrega</p>
            <p className="text-sm">{order.deliveryAddress.street}</p>
            <p className="text-sm">{order.deliveryAddress.city}</p>
          </div>
        </Popup>
      </Marker>

      {/* Route Line */}
      {polylinePositions.length > 1 && (
        <Polyline
          positions={polylinePositions}
          color="#3b82f6"
          weight={4}
          opacity={0.7}
          dashArray="10, 10"
        />
      )}
    </MapContainer>
  );
};

export default DeliveryMap;