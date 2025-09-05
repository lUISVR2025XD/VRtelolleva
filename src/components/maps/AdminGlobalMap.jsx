import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getStatusIcon = (status) => {
  const colorMap = {
    pending: 'grey',
    accepted: 'orange',
    preparing: 'yellow',
    ready: 'blue',
    delivering: 'violet',
    delivered: 'green',
    cancelled: 'red',
  };
  const color = colorMap[status] || 'grey';
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      accepted: 'Aceptado',
      preparing: 'Preparando',
      ready: 'Listo para Recoger',
      delivering: 'En Camino',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return statusMap[status] || 'Desconocido';
};

const BoundsUpdater = ({ bounds }) => {
  const map = useMap();
  React.useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
};

const AdminGlobalMap = ({ orders, deliveryPersons, businesses }) => {
  
  const mapPoints = useMemo(() => {
    return orders.map(order => {
      const business = businesses.find(b => b.id === order.businessId);
      const deliveryPerson = deliveryPersons.find(d => d.id === order.deliveryPersonId);
      return {
        order,
        business,
        deliveryPerson,
      };
    }).filter(point => point.business); // Only show orders with valid business location
  }, [orders, deliveryPersons, businesses]);

  const bounds = useMemo(() => {
    const latLngs = mapPoints.map(p => p.business.location);
    return L.latLngBounds(latLngs);
  }, [mapPoints]);

  const center = bounds.isValid() ? bounds.getCenter() : { lat: 40.7128, lng: -74.0060 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {mapPoints.map(({ order, business, deliveryPerson }) => (
        <Marker
          key={order.id}
          position={[order.deliveryAddress.coordinates.lat, order.deliveryAddress.coordinates.lng]}
          icon={getStatusIcon(order.status)}
        >
          <Popup>
            <div className="text-sm">
              <h3 className="font-bold text-base">Pedido #{order.id}</h3>
              <p><span className="font-semibold">Estado:</span> {getStatusText(order.status)}</p>
              <p><span className="font-semibold">Cliente:</span> {order.clientName}</p>
              <p><span className="font-semibold">Total:</span> ${order.total.toFixed(2)}</p>
              <hr className="my-1"/>
              <p><span className="font-semibold">Restaurante:</span> {business.name}</p>
              {deliveryPerson && <p><span className="font-semibold">Repartidor:</span> {deliveryPerson.name}</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {bounds.isValid() && <BoundsUpdater bounds={bounds} />}
    </MapContainer>
  );
};

export default AdminGlobalMap;