import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch, FaLocationArrow } from 'react-icons/fa';
import { getProfessionsList } from '../data/professionals';
import useGeolocation from '../hooks/useGeolocation';

const Home = () => {
  const navigate = useNavigate();
  const { location, getCurrentPosition, hasLocation, isLoading: locationLoading } = useGeolocation();
  const [searchForm, setSearchForm] = useState({
    profession: '',
    location: ''
  });
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const professions = getProfessionsList();

  useEffect(() => {
    // Auto-enable current location if available
    if (hasLocation && !searchForm.location) {
      setUseCurrentLocation(true);
    }
  }, [hasLocation, searchForm.location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'location' && value) {
      setUseCurrentLocation(false);
    }
  };

  const handleLocationRequest = () => {
    getCurrentPosition();
    setUseCurrentLocation(true);
    setSearchForm(prev => ({ ...prev, location: '' }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchForm.profession) {
      alert('Por favor selecciona un servicio');
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.set('profession', searchForm.profession);
    
    if (useCurrentLocation && hasLocation) {
      searchParams.set('lat', location.latitude.toString());
      searchParams.set('lng', location.longitude.toString());
      searchParams.set('useLocation', 'true');
    } else if (searchForm.location) {
      searchParams.set('location', searchForm.location);
    }
    
    navigate(`/search?${searchParams.toString()}`);
  };

  const quickSearchProfession = (profession) => {
    setSearchForm(prev => ({ ...prev, profession }));
    
    // If location is available, search immediately
    if (useCurrentLocation && hasLocation) {
      const searchParams = new URLSearchParams();
      searchParams.set('profession', profession);
      searchParams.set('lat', location.latitude.toString());
      searchParams.set('lng', location.longitude.toString());
      searchParams.set('useLocation', 'true');
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  return (
    <div className="home-component">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 px-6 rounded-2xl mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Encuentra el profesional que necesitas
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Conectamos con oficios verificados cerca de ti. Rápido, confiable y seguro.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="profession" className="block text-gray-700 font-medium mb-2 text-left">
                  <FaSearch className="inline mr-2" />
                  ¿Qué necesitas?
                </label>
                <select
                  id="profession"
                  name="profession"
                  value={searchForm.profession}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-800"
                  required
                >
                  <option value="">Selecciona un oficio</option>
                  {professions.map(prof => (
                    <option key={prof.value} value={prof.value}>
                      {prof.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-gray-700 font-medium mb-2 text-left">
                  <FaMapMarkerAlt className="inline mr-2" />
                  ¿Dónde?
                </label>
                <div className="relative">
                  {useCurrentLocation && hasLocation ? (
                    <div className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center justify-between">
                      <span className="flex items-center">
                        <FaLocationArrow className="mr-2" />
                        📍 Ubicación actual
                      </span>
                      <button
                        type="button"
                        onClick={() => setUseCurrentLocation(false)}
                        className="text-green-600 hover:text-green-800 text-sm underline"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <div className="flex">
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={searchForm.location}
                        onChange={handleInputChange}
                        placeholder="Ej: Palermo, CABA"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-800"
                        disabled={useCurrentLocation}
                      />
                      <button
                        type="button"
                        onClick={handleLocationRequest}
                        disabled={locationLoading}
                        className="px-4 py-3 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        title="Usar mi ubicación"
                      >
                        {locationLoading ? '⏳' : '📍'}
                      </button>
                    </div>
                  )}
                </div>
                
                {location.error && (
                  <p className="text-red-500 text-sm mt-1">{location.error}</p>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
            >
              {locationLoading ? 'Obteniendo ubicación...' : 'Buscar profesionales'}
            </button>
            
            {/* Location Status */}
            {hasLocation && (
              <div className="mt-4 text-center">
                <p className="text-sm text-green-600">
                  ✅ Ubicación detectada - encontraremos profesionales cerca de ti
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Quick Access Categories */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Oficios más solicitados
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div 
            onClick={() => quickSearchProfession('cerrajero')}
            className="card hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
              🔑
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cerrajero</h3>
            <p className="text-gray-600">Servicio 24hs disponible</p>
            <p className="text-primary-600 font-medium mt-2">Desde $2.500</p>
          </div>
          
          <div 
            onClick={() => quickSearchProfession('pintor')}
            className="card hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
              🎨
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Pintor</h3>
            <p className="text-gray-600">Interior y exterior</p>
            <p className="text-primary-600 font-medium mt-2">Desde $3.200</p>
          </div>
          
          <div 
            onClick={() => quickSearchProfession('electricista')}
            className="card hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
              ⚡
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Electricista</h3>
            <p className="text-gray-600">Instalaciones y reparaciones</p>
            <p className="text-primary-600 font-medium mt-2">Desde $2.800</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          ¿Por qué elegir OficioGo?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Profesionales verificados</h3>
            <p className="text-gray-600">Todos nuestros profesionales están verificados y tienen reputación comprobada.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Cerca de ti</h3>
            <p className="text-gray-600">Encuentra profesionales en tu zona para un servicio más rápido.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Calidad garantizada</h3>
            <p className="text-gray-600">Sistema de calificaciones y reseñas para asegurar la mejor experiencia.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;