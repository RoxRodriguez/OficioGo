import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleHome = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    profession: '',
    location: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Create search parameters
    const searchParams = new URLSearchParams();
    if (searchForm.profession) {
      searchParams.append('profession', searchForm.profession);
    }
    if (searchForm.location) {
      searchParams.append('location', searchForm.location);
    }

    // Navigate to search results
    navigate(`/search?${searchParams.toString()}`);
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
              <option value="electricista">Electricista</option>
              <option value="plomero">Plomero</option>
              <option value="cerrajero">Cerrajero</option>
              <option value="pintor">Pintor</option>
              <option value="jardinero">Jardinero</option>
            </select>
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Dónde?
            </label>
            <input
              type="text"
              value={searchForm.location}
              onChange={(e) => setSearchForm(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ingresa tu ubicación"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full btn-primary py-3 px-6 text-lg font-medium"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { name: 'Electricista', icon: '⚡', color: 'bg-yellow-100 text-yellow-700' },
          { name: 'Plomero', icon: '🔧', color: 'bg-blue-100 text-blue-700' },
          { name: 'Cerrajero', icon: '🔐', color: 'bg-green-100 text-green-700' },
          { name: 'Pintor', icon: '🎨', color: 'bg-purple-100 text-purple-700' }
        ].map((service) => (
          <button
            key={service.name}
            onClick={() => {
              setSearchForm(prev => ({ ...prev, profession: service.name.toLowerCase() }));
              navigate(`/search?profession=${service.name.toLowerCase()}`);
            }}
            className={`${service.color} p-4 rounded-lg hover:opacity-80 transition-opacity`}
          >
            <div className="text-2xl mb-2">{service.icon}</div>
            <div className="font-medium">{service.name}</div>
          </button>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Profesionales Verificados</h3>
          <p className="text-gray-600">Todos nuestros profesionales están verificados y tienen experiencia comprobada.</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Respuesta Rápida</h3>
          <p className="text-gray-600">Conecta con profesionales en minutos y obtén respuestas inmediatas.</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Mejores Precios</h3>
          <p className="text-gray-600">Compara precios y elige la mejor opción para tu presupuesto.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleHome;