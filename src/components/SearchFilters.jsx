import React, { useState } from 'react';
import { FaMapMarkerAlt, FaSliders, FaStar, FaDollarSign, FaShield, FaClock, FaSearch } from 'react-icons/fa';
import { getProfessionsList, getNeighborhoods } from '../data/professionals';

const SearchFilters = ({ 
  onFiltersChange, 
  userLocation, 
  onLocationRequest,
  initialFilters = {},
  showMap = false,
  onToggleMap 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    profession: '',
    maxDistance: 20,
    minRating: 0,
    maxPrice: 10000,
    isAvailable: null,
    emergencyService: null,
    isVerified: null,
    neighborhood: '',
    ...initialFilters
  });

  const professions = getProfessionsList();
  const neighborhoods = getNeighborhoods();

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange({
      ...newFilters,
      userLocation
    });
  };

  const resetFilters = () => {
    const defaultFilters = {
      profession: '',
      maxDistance: 20,
      minRating: 0,
      maxPrice: 10000,
      isAvailable: null,
      emergencyService: null,
      isVerified: null,
      neighborhood: ''
    };
    setFilters(defaultFilters);
    onFiltersChange({
      ...defaultFilters,
      userLocation
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.profession) count++;
    if (filters.minRating > 0) count++;
    if (filters.maxPrice < 10000) count++;
    if (filters.isAvailable !== null) count++;
    if (filters.emergencyService !== null) count++;
    if (filters.isVerified !== null) count++;
    if (filters.neighborhood) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Basic Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Profession Select */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaSearch className="inline mr-2" />
            ¿Qué servicio necesitas?
          </label>
          <select
            value={filters.profession}
            onChange={(e) => handleFilterChange('profession', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos los servicios</option>
            {professions.map(prof => (
              <option key={prof.value} value={prof.value}>
                {prof.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaMapMarkerAlt className="inline mr-2" />
            Ubicación
          </label>
          <div className="flex space-x-2">
            {userLocation ? (
              <div className="flex-1 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                📍 Ubicación actual detectada
              </div>
            ) : (
              <select
                value={filters.neighborhood}
                onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar barrio</option>
                {neighborhoods.map(neighborhood => (
                  <option key={neighborhood.value} value={neighborhood.value}>
                    {neighborhood.label}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={onLocationRequest}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              title="Usar mi ubicación"
            >
              📍
            </button>
          </div>
        </div>

        {/* Distance */}
        {userLocation && (
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Radio: {filters.maxDistance} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.maxDistance}
              onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <FaSliders />
          <span>Filtros avanzados</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>

        <div className="flex items-center space-x-2">
          {onToggleMap && (
            <button
              onClick={onToggleMap}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                showMap 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showMap ? '📋 Lista' : '🗺️ Mapa'}
            </button>
          )}
          
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaStar className="inline mr-2 text-yellow-400" />
              Calificación mínima
            </label>
            <select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={0}>Cualquiera</option>
              <option value={3}>⭐⭐⭐ 3+</option>
              <option value={4}>⭐⭐⭐⭐ 4+</option>
              <option value={4.5}>⭐⭐⭐⭐⭐ 4.5+</option>
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaDollarSign className="inline mr-2 text-green-500" />
              Precio máximo: ${filters.maxPrice.toLocaleString()}
            </label>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaClock className="inline mr-2 text-blue-500" />
              Disponibilidad
            </label>
            <select
              value={filters.isAvailable === null ? '' : filters.isAvailable.toString()}
              onChange={(e) => handleFilterChange('isAvailable', 
                e.target.value === '' ? null : e.target.value === 'true'
              )}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Cualquiera</option>
              <option value="true">Solo disponibles</option>
              <option value="false">Solo ocupados</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaShield className="inline mr-2 text-blue-600" />
              Verificación
            </label>
            <select
              value={filters.isVerified === null ? '' : filters.isVerified.toString()}
              onChange={(e) => handleFilterChange('isVerified', 
                e.target.value === '' ? null : e.target.value === 'true'
              )}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Cualquiera</option>
              <option value="true">Solo verificados</option>
              <option value="false">No verificados</option>
            </select>
          </div>

          {/* Emergency Service Filter */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servicio de emergencia
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="emergencyService"
                  checked={filters.emergencyService === null}
                  onChange={() => handleFilterChange('emergencyService', null)}
                  className="mr-2"
                />
                <span className="text-sm">Cualquiera</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="emergencyService"
                  checked={filters.emergencyService === true}
                  onChange={() => handleFilterChange('emergencyService', true)}
                  className="mr-2"
                />
                <span className="text-sm">Solo emergencias</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="emergencyService"
                  checked={filters.emergencyService === false}
                  onChange={() => handleFilterChange('emergencyService', false)}
                  className="mr-2"
                />
                <span className="text-sm">Sin emergencias</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;