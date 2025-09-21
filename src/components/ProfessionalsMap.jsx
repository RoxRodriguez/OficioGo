import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { FaStar, FaMapMarkerAlt, FaClock, FaShield } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createIcon = (color, type = 'professional') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
      ">
        ${type === 'user' ? '📍' : '🔧'}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to fit map bounds
const FitBounds = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [bounds, map]);
  
  return null;
};

const ProfessionalsMap = ({ 
  professionals = [], 
  userLocation = null, 
  searchRadius = 20,
  onProfessionalSelect,
  height = '400px',
  showRadius = true,
  center = null
}) => {
  const [mapCenter, setMapCenter] = useState(center || [-34.6037, -58.3816]); // Buenos Aires default
  const [mapBounds, setMapBounds] = useState([]);

  useEffect(() => {
    // Calculate bounds to include all professionals and user location
    const bounds = [];
    
    if (userLocation) {
      bounds.push([userLocation.latitude, userLocation.longitude]);
    }
    
    professionals.forEach(prof => {
      if (prof.location?.coordinates) {
        bounds.push([prof.location.coordinates.lat, prof.location.coordinates.lng]);
      }
    });
    
    setMapBounds(bounds);
    
    // Set center to user location if available
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude]);
    }
  }, [professionals, userLocation]);

  const getProfessionColor = (profession) => {
    const colors = {
      cerrajero: '#f59e0b', // amber
      pintor: '#3b82f6',    // blue
      electricista: '#ef4444', // red
      plomero: '#10b981',   // green
      carpintero: '#8b5cf6', // purple
      default: '#6b7280'    // gray
    };
    return colors[profession] || colors.default;
  };

  return (
    <div className="relative">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height, width: '100%' }}
        className="rounded-lg shadow-md"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={createIcon('#ef4444', 'user')}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">Tu ubicación</h3>
                  <p className="text-xs text-gray-600">
                    {userLocation.address || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
                  </p>
                </div>
              </Popup>
            </Marker>
            
            {/* Search radius circle */}
            {showRadius && (
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={searchRadius * 1000} // Convert km to meters
                fillColor="#3b82f6"
                fillOpacity={0.1}
                color="#3b82f6"
                weight={2}
                opacity={0.5}
              />
            )}
          </>
        )}
        
        {/* Professional markers */}
        {professionals.map((professional) => {
          if (!professional.location?.coordinates) return null;
          
          return (
            <Marker
              key={professional.id}
              position={[
                professional.location.coordinates.lat,
                professional.location.coordinates.lng
              ]}
              icon={createIcon(getProfessionColor(professional.profession))}
              eventHandlers={{
                click: () => onProfessionalSelect?.(professional)
              }}
            >
              <Popup maxWidth={300}>
                <div className="p-3 min-w-[250px]">
                  <div className="flex items-start space-x-3">
                    <img
                      src={professional.profileImage}
                      alt={professional.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{professional.name}</h3>
                        {professional.isVerified && (
                          <FaShield className="text-blue-500 text-xs" />
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 capitalize">
                        {professional.profession}
                      </p>
                      
                      <div className="flex items-center mt-1">
                        <div className="flex items-center space-x-1">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-xs font-medium">{professional.rating}</span>
                          <span className="text-xs text-gray-500">
                            ({professional.totalReviews})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-1 space-x-3">
                        <div className="flex items-center space-x-1">
                          <FaMapMarkerAlt className="text-gray-400 text-xs" />
                          <span className="text-xs text-gray-600">
                            {professional.distance ? `${professional.distance} km` : professional.location.neighborhood}
                          </span>
                        </div>
                        
                        {professional.estimatedTime && (
                          <div className="flex items-center space-x-1">
                            <FaClock className="text-gray-400 text-xs" />
                            <span className="text-xs text-gray-600">
                              ~{professional.estimatedTime} min
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <div className="text-sm font-semibold text-primary-600">
                          ${professional.baseRate.toLocaleString()} {professional.currency}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                          professional.isAvailable 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {professional.isAvailable ? 'Disponible' : 'Ocupado'}
                        </div>
                      </div>
                      
                      {onProfessionalSelect && (
                        <button
                          onClick={() => onProfessionalSelect(professional)}
                          className="w-full mt-2 px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 transition-colors"
                        >
                          Ver perfil
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Fit bounds to show all markers */}
        <FitBounds bounds={mapBounds} />
      </MapContainer>
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
        <h4 className="font-semibold mb-2">Leyenda</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              📍
            </div>
            <span>Tu ubicación</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs">
              🔧
            </div>
            <span>Cerrajero</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
              🔧
            </div>
            <span>Pintor</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              🔧
            </div>
            <span>Electricista</span>
          </div>
        </div>
      </div>
      
      {/* Search radius info */}
      {showRadius && userLocation && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full opacity-50"></div>
            <span>Radio de búsqueda: {searchRadius} km</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalsMap;