// components/MapComponent.tsx
'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define props type
interface MapComponentProps {
  partyLat: number;
  partyLng: number;
}

const MapComponent = ({ partyLat, partyLng }: MapComponentProps) => {
  const mapInstanceRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([partyLat, partyLng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add party location marker
      if (mapInstanceRef.current) {
        L.marker([partyLat, partyLng])
          .addTo(mapInstanceRef.current)
          .bindPopup('Party Location! 🎉')
          .openPopup();
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [partyLat, partyLng]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-2xl overflow-hidden shadow-lg"
    />
  );
};

export default MapComponent;