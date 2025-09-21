import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchWithFilters, searchProfessionalsByLocation } from '../data/professionals';
import useGeolocation from '../hooks/useGeolocation';
import SearchFilters from './SearchFilters';
import ProfessionalsMap from './ProfessionalsMap';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { location: userLocation, getCurrentPosition } = useGeolocation();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('distance');
  const [showMap, setShowMap] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  // Get search parameters
  const profession = searchParams.get('profession') || '';
  const location = searchParams.get('location') || '';
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const useLocation = searchParams.get('useLocation') === 'true';

  // Initial location state
  const searchLocation = (lat && lng) ? {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng)
  } : null;

  useEffect(() => {
    performSearch();
  }, [profession, location, lat, lng, useLocation, userLocation]);

  const performSearch = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = [];
      
      // Use geolocation search if coordinates are available
      if (searchLocation || (useLocation && userLocation.latitude)) {
        const coords = searchLocation || userLocation;
        results = searchProfessionalsByLocation(
          coords.latitude,
          coords.longitude,
          20, // 20km radius
          profession
        );
      } else {
        // Use regular search with filters
        results = searchWithFilters({
          profession,
          userLocation: searchLocation || (useLocation ? userLocation : null),
          ...currentFilters
        });
      }
      
      setProfessionals(results);
      setLoading(false);
    }, 500);
  };

  const handleFiltersChange = (newFilters) => {
    setCurrentFilters(newFilters);
    
    // Perform new search with filters
    setLoading(true);
    setTimeout(() => {
      const results = searchWithFilters({
        profession,
        ...newFilters
      });
      setProfessionals(results);
      setLoading(false);
    }, 300);
  };

  const handleLocationRequest = () => {
    getCurrentPosition();
  };

  const sortedProfessionals = [...professionals].sort((a, b) => {
    if (sortBy === 'distance' && a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'price') {
      return a.baseRate - b.baseRate;
    } else if (sortBy === 'availability') {
      return b.isAvailable - a.isAvailable;
    }
    return 0;
  });

  const handleProfessionalSelect = (professional) => {
    navigate(`/professional/${professional.id}`);
  };

  const handleProfessionalClick = (professionalId) => {
    navigate(`/professional/${professionalId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star">☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Buscando profesionales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Resultados para "{profession || 'Todos los servicios'}"
        </h1>
        {(location || searchLocation || (useLocation && userLocation.latitude)) && (
          <p className="text-gray-600 text-lg">
            {searchLocation || (useLocation && userLocation.latitude) ? 
              '📍 Cerca de tu ubicación' : 
              `Cerca de: ${location}`
            }
          </p>
        )}
        <p className="text-gray-500 mt-2">
          {professionals.length} profesional{professionals.length !== 1 ? 'es' : ''} encontrado{professionals.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search Filters */}
      <SearchFilters
        onFiltersChange={handleFiltersChange}
        userLocation={searchLocation || (useLocation ? userLocation : null)}
        onLocationRequest={handleLocationRequest}
        initialFilters={{ profession }}
        showMap={showMap}
        onToggleMap={() => setShowMap(!showMap)}
      />

      {/* Map or List Toggle */}
      {showMap ? (
        <div className="mb-6">
          <ProfessionalsMap
            professionals={sortedProfessionals}
            userLocation={searchLocation || (useLocation && userLocation.latitude ? userLocation : null)}
            searchRadius={20}
            onProfessionalSelect={handleProfessionalSelect}
            height="500px"
            showRadius={true}
          />
        </div>
      ) : (
        <>
          {/* Sort Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {(searchLocation || (useLocation && userLocation.latitude)) && (
                    <option value="distance">Más cercano</option>
                  )}
                  <option value="rating">Mejor calificación</option>
                  <option value="price">Menor precio</option>
                  <option value="availability">Disponibilidad</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  🟢 Disponible ahora • 🔴 No disponible
                </span>
              </div>
            </div>
          </div>

          {/* Results List */}
          {sortedProfessionals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No se encontraron profesionales
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta ampliar tu búsqueda o cambiar los filtros
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                Nueva búsqueda
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {sortedProfessionals.map((professional) => (
                <div key={professional.id} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row">
                    {/* Professional Image */}
                    <div className="md:w-32 md:h-32 w-full h-48 md:flex-shrink-0">
                      <img
                        src={professional.profileImage}
                        alt={professional.name}
                        className="w-full h-full object-cover rounded-lg md:rounded-l-lg md:rounded-r-none"
                      />
                    </div>
                    
                    {/* Professional Info */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-800 mr-3">
                              {professional.name}
                            </h3>
                            {professional.isVerified && (
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center">
                                🛡️ Verificado
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 capitalize mb-2">{professional.profession}</p>
                          
                          {/* Rating */}
                          <div className="flex items-center mb-3">
                            <div className="flex text-yellow-400 mr-2">
                              {renderStars(professional.rating)}
                            </div>
                            <span className="text-gray-700 font-medium">{professional.rating}</span>
                            <span className="text-gray-500 ml-1">({professional.totalReviews} reseñas)</span>
                          </div>
                          
                          {/* Location and Distance */}
                          <div className="flex items-center mb-3 text-gray-600">
                            <span className="mr-4">📍 {professional.location.neighborhood}</span>
                            {professional.distance && (
                              <span className="mr-4">🚗 {professional.distance} km</span>
                            )}
                            {professional.estimatedTime && (
                              <span>⏱️ ~{professional.estimatedTime} min</span>
                            )}
                          </div>
                          
                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {professional.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {professional.skills.length > 3 && (
                              <span className="text-gray-500 text-xs">
                                +{professional.skills.length - 3} más
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Price and Actions */}
                        <div className="flex flex-col items-end">
                          <div className="text-right mb-3">
                            <div className="text-2xl font-bold text-primary-600">
                              ${professional.baseRate.toLocaleString()}
                            </div>
                            <div className="text-gray-500 text-sm">{professional.currency}</div>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              professional.isAvailable 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {professional.isAvailable ? '🟢 Disponible' : '🔴 No disponible'}
                            </span>
                          </div>
                          
                          {professional.emergencyService && (
                            <div className="mb-3">
                              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                                ⚡ Emergencias 24hs
                              </span>
                            </div>
                          )}
                          
                          <button
                            onClick={() => handleProfessionalClick(professional.id)}
                            className="btn-primary w-full md:w-auto"
                          >
                            Ver perfil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;