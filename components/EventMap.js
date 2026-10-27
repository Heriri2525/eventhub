'use client';

// TOPIC: Maps, real-time and data formats - Leaflet map component
// TOPIC: Error boundary, performance, lazy loading - Lazy loaded map component
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_TILE_URL, MAP_ATTRIBUTION } from '@/lib/constants';

// Fix for default marker icon in Leaflet with Next.js
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

export function EventMap({ event, height = '400px' }) {
  const position = [event.location.lat, event.location.lng];

  return (
    <div style={{ height, width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution={MAP_ATTRIBUTION}
          url={MAP_TILE_URL}
        />
        <Marker position={position}>
          <Popup>
            <strong>{event.title}</strong>
            <br />
            {event.location.name}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
