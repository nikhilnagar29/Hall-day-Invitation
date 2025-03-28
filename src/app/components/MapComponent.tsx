// components/MapComponent.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Define props type
interface MapComponentProps {
  partyLat: number;
  partyLng: number;
}

const MapComponent = ({ partyLat, partyLng }: MapComponentProps) => {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;
      await import('leaflet-routing-machine');

      // Initialize map
      mapInstanceRef.current = L.map('map').setView([partyLat, partyLng], 15);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add party location marker
      const partyIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });

      L.marker([partyLat, partyLng], { icon: partyIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('🎉 Party Location!')
        .openPopup();

      // Get user's location with high accuracy
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos: [number, number] = [
              position.coords.latitude,
              position.coords.longitude
            ];
            setUserLocation(userPos);

            // Add user location marker
            const userIcon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41]
            });

            L.marker(userPos, { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup('📍 You')
              .openPopup();
          },
          (error) => {
            alert(`Error getting location: ${error.message}`);
            mapInstanceRef.current.setView([partyLat, partyLng], 15);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [partyLat, partyLng]);

  return <div id="map" style={{ height: '500px', width: '100%', borderRadius: '15px' }} />;
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });