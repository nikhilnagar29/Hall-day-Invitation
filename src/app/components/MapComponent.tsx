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

export default function MapComponent({ partyLat, partyLng }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const partyMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize map if not already initialized
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map('map').setView([partyLat, partyLng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add party location marker
      const partyIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });

      partyMarkerRef.current = L.marker([partyLat, partyLng], { icon: partyIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('Party Location: Room C-428');

      // Try to get user's location
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Add user location marker
            const userIcon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
              shadowAnchor: [12, 41]
            });

            if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng([latitude, longitude]);
            } else {
              const map = mapInstanceRef.current;
              if (map) {
                userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
                  .addTo(map)
                  .bindPopup('Your Location');
              }
            }

            // Fit bounds to show both markers
            const bounds = L.latLngBounds(
              [latitude, longitude],
              [partyLat, partyLng]
            );
            if (mapInstanceRef.current) {
              mapInstanceRef.current!.fitBounds(bounds, { padding: [50, 50] });
            }
          },
          (error) => {
            console.log('Location access denied or unavailable');
            // Center map on party location if user location is not available
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView([partyLat, partyLng], 15);
            }
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser');
        // Center map on party location if geolocation is not supported
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([partyLat, partyLng], 15);
        }
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

  return <div id="map" className="w-full h-full" />;
}