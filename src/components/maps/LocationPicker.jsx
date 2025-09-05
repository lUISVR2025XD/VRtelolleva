
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import { useToast } from '@/components/ui/use-toast';
import 'leaflet-geosearch/dist/geosearch.css';

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const SearchControl = ({ onLocationSelect }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false,
      autoClose: true,
      keepResult: true,
      searchLabel: 'Buscar dirección...',
      notFoundMessage: 'Lo sentimos, esa dirección no se encontró.',
    });

    map.addControl(searchControl);

    const onResult = (e) => {
        onLocationSelect({
            lat: e.location.y,
            lng: e.location.x,
        }, e.location.label);
    };
    
    map.on('geosearch/showlocation', onResult);

    return () => {
        map.off('geosearch/showlocation', onResult);
        map.removeControl(searchControl);
    };
  }, [map, onLocationSelect]);

  return null;
};

const LocationPicker = ({ onLocationChange, initialPosition, triggerLocate }) => {
  const { toast } = useToast();
  const [position, setPosition] = useState(initialPosition);

  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (triggerLocate > 0) {
        map.locate({
            timeout: 10000, // 10 seconds
            enableHighAccuracy: true,
        });
      }
    }, [triggerLocate, map]);

    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, 16);
        toast({ title: 'Ubicación encontrada', description: 'Se ha establecido tu ubicación actual.' });
      },
      locationerror(e) {
        toast({ title: 'Error de ubicación', description: e.message, variant: 'destructive' });
      },
    });

    const draggableMarker = useMemo(
      () => (
        <Marker
          draggable={true}
          eventHandlers={{
            dragend(e) {
              const marker = e.target;
              const newPosition = marker.getLatLng();
              setPosition(newPosition);
            },
          }}
          position={position}
          icon={customIcon}
        />
      ),
      [position]
    );

    return position === null ? null : draggableMarker;
  };

  const handleLocationSelect = useCallback((newPos, address) => {
      setPosition(newPos);
      onLocationChange(newPos, address);
  }, [onLocationChange]);

  useEffect(() => {
    if (position) {
      const fetchAddress = async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          const address = data.display_name || `Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`;
          onLocationChange(position, address);
        } catch (error) {
          console.error("Error fetching address: ", error);
          onLocationChange(position, `Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`);
        }
      };
      fetchAddress();
    }
  }, [position, onLocationChange]);
  
  const FlyToButton = ({ pos }) => {
    const map = useMap();
    useEffect(() => {
        if(pos) {
            map.flyTo(pos, 16);
        }
    }, [pos, map]);
    return null;
  }

  return (
    <div className="h-64 md:h-80 w-full rounded-2xl overflow-hidden relative border-2 border-white/20 location-picker-container">
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        <FlyToButton pos={position} />
        <SearchControl onLocationSelect={handleLocationSelect}/>
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
