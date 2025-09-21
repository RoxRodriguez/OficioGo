import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch, FaLocationArrow } from 'react-icons/fa';
import useSimpleGeolocation from '../hooks/useSimpleGeolocation';

const WorkingHome = () => {
  const navigate = useNavigate();
  const { location, getCurrentPosition, hasLocation, isLoading: locationLoading } = useSimpleGeolocation();
  const [searchForm, setSearchForm] = useState({
    profession: '',
    location: ''
  });
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const professions = [
    'electricista',
    'plomero', 
    'cerrajero',
    'pintor',
    'jardinero',
    'gasista',
    'carpintero',
    'albañil'
  ];

  useEffect(() => {
    // Auto-enable current location if available
    if (hasLocation && !searchForm.location) {
      setUseCurrentLocation(true);
      setSearchForm(prev => ({ ...prev, location: 'Tu ubicación actual' }));
    }
  }, [hasLocation, searchForm.location]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Create search parameters
    const searchParams = new URLSearchParams();
    
    if (searchForm.profession) {
      searchParams.append('profession', searchForm.profession);
    }
    
    if (useCurrentLocation && hasLocation) {
      searchParams.append('lat', location.latitude.toString());
      searchParams.append('lng', location.longitude.toString());
      searchParams.append('useLocation', 'true');
    } else if (searchForm.location && !useCurrentLocation) {
      searchParams.append('location', searchForm.location);
    }

    // Navigate to search results
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleLocationClick = () => {
    if (!hasLocation) {
      getCurrentPosition();
    }
    setUseCurrentLocation(!useCurrentLocation);
    
    if (!useCurrentLocation) {
      setSearchForm(prev => ({ ...prev, location: 'Tu ubicación actual' }));
    } else {
      setSearchForm(prev => ({ ...prev, location: '' }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Encuentra el <span className="text-primary-600">profesional</span> perfecto
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Conectamos personas con profesionales verificados cerca de ti. 
          Rápido, confiable y al mejor precio.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-12">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profession Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué necesitas?
            </label>
            <select
              value={searchForm.profession}
              onChange={(e) => setSearchForm(prev => ({ ...prev, profession: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Seleccionar servicio</option>
              {professions.map(profession => (
                <option key={profession} value={profession}>
                  {profession.charAt(0).toUpperCase() + profession.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Dónde?
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchForm.location}
                onChange={(e) => {
                  setSearchForm(prev => ({ ...prev, location: e.target.value }));
                  setUseCurrentLocation(false);
                }}
                placeholder="Ingresa tu ubicación"
                disabled={useCurrentLocation}
                className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  useCurrentLocation ? 'bg-gray-100 text-gray-600' : ''
                }`}
              />
              <button
                type="button"
                onClick={handleLocationClick}
                disabled={locationLoading}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                  useCurrentLocation ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'
                } ${locationLoading ? 'animate-spin' : ''}`}
              >
                {locationLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaLocationArrow className="w-5 h-5" />
                )}
              </button>
            </div>
            {useCurrentLocation && hasLocation && (
              <p className="text-xs text-green-600 mt-1">📍 Usando tu ubicación actual</p>
            )}
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full btn-primary py-3 px-6 text-lg font-medium flex items-center justify-center space-x-2"
            >
              <FaSearch className="w-5 h-5" />
              <span>Buscar</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick Access Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Servicios más solicitados
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Electricista', icon: '⚡', color: 'bg-yellow-100 text-yellow-700', profession: 'electricista' },
            { name: 'Plomero', icon: '🔧', color: 'bg-blue-100 text-blue-700', profession: 'plomero' },
            { name: 'Cerrajero', icon: '🔐', color: 'bg-green-100 text-green-700', profession: 'cerrajero' },
            { name: 'Pintor', icon: '🎨', color: 'bg-purple-100 text-purple-700', profession: 'pintor' }
          ].map((service) => (
            <button
              key={service.name}
              onClick={() => {
                const searchParams = new URLSearchParams();
                searchParams.append('profession', service.profession);
                
                if (useCurrentLocation && hasLocation) {
                  searchParams.append('lat', location.latitude.toString());
                  searchParams.append('lng', location.longitude.toString());
                  searchParams.append('useLocation', 'true');
                }
                
                navigate(`/search?${searchParams.toString()}`);
              }}
              className={`${service.color} p-4 rounded-lg hover:opacity-80 transition-opacity text-center`}
            >
              <div className="text-3xl mb-2">{service.icon}</div>
              <div className="font-medium text-sm">{service.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="text-5xl mb-4">🛡️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Profesionales Verificados</h3>
          <p className="text-gray-600">Todos nuestros profesionales están verificados y tienen experiencia comprobada.</p>
        </div>
        <div className="text-center">
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Respuesta Rápida</h3>
          <p className="text-gray-600">Conecta con profesionales en minutos y obtén respuestas inmediatas.</p>
        </div>
        <div className="text-center">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Mejores Precios</h3>
          <p className="text-gray-600">Compara precios y elige la mejor opción para tu presupuesto.</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-100 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ¿Cómo funciona?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Busca el servicio</h4>
            <p className="text-gray-600 text-sm">Describe qué necesitas y dónde lo necesitas</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Compara opciones</h4>
            <p className="text-gray-600 text-sm">Revisa perfiles, precios y reseñas de profesionales</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Contrata con confianza</h4>
            <p className="text-gray-600 text-sm">Conecta directamente y obtén el trabajo hecho</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingHome;