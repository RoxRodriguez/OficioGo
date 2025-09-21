import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';
import { useAdvancedGeolocation } from '../hooks/useAdvancedGeolocation';
import mockApiService from '../services/mockApiService';

const ProfessionalsMapPage = () => {
  const navigate = useNavigate();
  const { user, isClient, isProfessional } = useAuth();
  const { 
    location: userLocation, 
    error: locationError, 
    loading: locationLoading, 
    getCurrentLocation,
    calculateDistance 
  } = useAdvancedGeolocation();
  
  // Ubicación por defecto (Centro de CABA)
  const defaultLocation = { lat: -34.6037, lng: -58.3816 };
  const effectiveLocation = userLocation || defaultLocation;
  
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [selectedService, setSelectedService] = useState('all');
  const [sortBy, setSortBy] = useState('distance'); // distance, rating, price
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState(null);

  // Función para obtener dirección desde coordenadas (geocodificación inversa)
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const { road, house_number, suburb, city, state, country } = data.address;
        
        // Construir dirección legible
        let address = '';
        if (road) {
          address += road;
          if (house_number) address += ` ${house_number}`;
        }
        if (suburb) address += address ? `, ${suburb}` : suburb;
        if (city) address += address ? `, ${city}` : city;
        if (state) address += address ? `, ${state}` : state;
        
        return address || `${city || state || country || 'Ubicación detectada'}`;
      }
      return 'Ubicación detectada';
    } catch (error) {
      console.error('Error en geocodificación:', error);
      return 'Ubicación detectada';
    }
  };

  // Cargar profesionales desde el servicio
  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setLoading(true);
        const professionalsData = await mockApiService.getProfessionals({
          service: selectedService,
          availability: showAvailableOnly ? true : undefined
        });
        
        // Calcular distancias usando ubicación efectiva (real o por defecto)
        const professionalsWithDistance = professionalsData.map(prof => {
          let distance = null;
          if (effectiveLocation && prof.location) {
            distance = mockApiService.calculateDistance(effectiveLocation, prof.location);
          }
          
          return {
            ...prof,
            distance,
            profession: prof.service,
            image: prof.avatar,
            price: prof.priceRange ? `$${prof.priceRange}/servicio` : 'Consultar',
            reviews: prof.completedJobs || 0,
            available: prof.availability,
            services: prof.specialties || [],
            completedJobs: prof.completedJobs || 0
          };
        });
        
        setProfessionals(professionalsWithDistance);
      } catch (error) {
        console.error('Error loading professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, [selectedService, showAvailableOnly, effectiveLocation]);

  // Initialize location on component mount
  useEffect(() => {
    // Solo solicitar ubicación una vez al montar el componente
    if (!userLocation && !locationLoading) {
      getCurrentLocation();
    }
  }, []); // Array vacío para ejecutar solo una vez

  // Obtener dirección cuando se detecta ubicación
  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      getAddressFromCoordinates(userLocation.lat, userLocation.lng)
        .then(address => {
          setUserAddress(address);
        });
    }
  }, [userLocation]);

  // Get user location
  const getUserLocation = () => {
    console.log('Solicitando ubicación del usuario...');
    setUserAddress(null); // Resetear dirección al solicitar nueva ubicación
    getCurrentLocation();
  };

  // Handle professional actions
  const handleContactProfessional = (professional) => {
    if (!user) {
      alert('Debes iniciar sesión para contactar profesionales');
      return;
    }
    // Redirigir al chat con datos del profesional
    navigate('/chat', { 
      state: { 
        selectedProfessional: {
          id: professional.id,
          name: professional.name,
          service: professional.service,
          avatar: professional.service === 'Plomería' ? '🔧' : 
                 professional.service === 'Electricidad' ? '⚡' : 
                 professional.service === 'Pintura' ? '🎨' : 
                 professional.service === 'Carpintería' ? '🪚' : 
                 professional.service === 'Jardinería' ? '🌱' : '🔧'
        }
      }
    });
  };

  const handleViewProfile = (professional) => {
    // Redirigir al perfil del profesional con datos reales
    navigate('/profile', { 
      state: { 
        viewingProfessional: {
          id: professional.id,
          name: professional.name,
          service: professional.service || professional.profession,
          avatar: professional.avatar || professional.image,
          rating: professional.rating,
          experience: professional.experience,
          completedJobs: professional.completedJobs,
          description: professional.description,
          specialties: professional.specialties || professional.services,
          location: professional.location,
          responseTime: professional.responseTime,
          priceRange: professional.priceRange || professional.price
        }
      }
    });
  };

  const handleRequestService = (professional) => {
    if (!user) {
      alert('Debes iniciar sesión para solicitar servicios');
      return;
    }
    // Redirigir al formulario de solicitud con datos del profesional
    navigate('/create-request', { 
      state: { 
        selectedProfessional: {
          id: professional.id,
          name: professional.name,
          service: professional.service,
          avatar: professional.service === 'Plomería' ? '🔧' : 
                 professional.service === 'Electricidad' ? '⚡' : 
                 professional.service === 'Pintura' ? '🎨' : 
                 professional.service === 'Carpintería' ? '🪚' : 
                 professional.service === 'Jardinería' ? '🌱' : '🔧'
        }
      }
    });
  };

  const filteredProfessionals = professionals
    .filter(prof => {
      // Filtro por distancia
      const distanceMatch = prof.distance ? prof.distance <= selectedRadius : true;
      
      // Filtro por tipo de servicio
      const serviceMatch = selectedService === 'all' || 
                          (prof.service && prof.service.toLowerCase().includes(selectedService.toLowerCase())) ||
                          (prof.profession && prof.profession.toLowerCase().includes(selectedService.toLowerCase())) ||
                          (prof.services && prof.services.some(service => service.toLowerCase().includes(selectedService.toLowerCase())));
      
      // Filtro por disponibilidad
      const availabilityMatch = !showAvailableOnly || prof.available || prof.availability;
      
      // Debug logging
      if (selectedService !== 'all') {
        console.log(`Filtro: ${selectedService}, Prof: ${prof.name}, Service: ${prof.service}, Match: ${serviceMatch}`);
      }
      
      return distanceMatch && serviceMatch && availabilityMatch;
    })
    .sort((a, b) => {
      // Ordenamiento dinámico
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          // Extraer número del precio para comparar
          const priceA = parseFloat(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        default:
          return 0;
      }
    });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            {isClient() ? 'Encuentra Profesionales Cerca' : 'Profesionales en tu Área'}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            {isClient() 
              ? 'Descubre los mejores profesionales en tu ubicación'
              : 'Conecta con clientes y otros profesionales cercanos'
            }
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Location Status */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>📍</span>
          <div style={{ flex: 1 }}>
            {locationLoading ? (
              <p style={{ margin: 0, color: '#6b7280' }}>Obteniendo tu ubicación...</p>
            ) : userLocation ? (
              <div>
                <p style={{ margin: 0, color: '#16a34a', fontWeight: '600' }}>
                  Ubicación detectada
                </p>
                {userAddress ? (
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#16a34a' }}>
                    {userAddress}
                  </p>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                    Obteniendo dirección...
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p style={{ margin: 0, color: '#f59e0b', fontWeight: '600' }}>
                  Usando ubicación por defecto (Centro de CABA)
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                  Haz clic en "Actualizar ubicación" para obtener resultados más precisos
                </p>
              </div>
            )}
            {locationError && (
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#dc2626' }}>
                Error: {locationError} - Usando ubicación por defecto
              </p>
            )}
          </div>
          <button
            onClick={getUserLocation}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            📡 Actualizar ubicación
          </button>
        </div>

        {/* Filters */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937' }}>🔍 Filtros de Búsqueda</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Service Filter */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Tipo de Servicio
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  outline: 'none',
                  background: 'white'
                }}
              >
                <option value="all">Todos los servicios</option>
                <option value="Plomería">Plomería</option>
                <option value="Electricidad">Electricidad</option>
                <option value="Construcción">Construcción</option>
                <option value="Pintura">Pintura</option>
                <option value="Mecánica">Mecánica</option>
                <option value="Carpintería">Carpintería</option>
                <option value="Limpieza">Limpieza</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  outline: 'none',
                  background: 'white'
                }}
              >
                <option value="distance">🗺️ Distancia (menor a mayor)</option>
                <option value="rating">⭐ Calificación (mayor a menor)</option>
                <option value="price">💰 Precio (menor a mayor)</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Disponibilidad
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: showAvailableOnly ? '#dcfce7' : 'white'
              }}>
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Solo disponibles
              </label>
            </div>
          </div>

          {/* Radius Filter - Full Width */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Radio de búsqueda: {selectedRadius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '0.5rem',
                background: '#e5e7eb',
                borderRadius: '0.25rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              <span>1 km</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
              Filtros rápidos:
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setSelectedRadius(5);
                  setSelectedService('all');
                  setShowAvailableOnly(true);
                  setSortBy('distance');
                }}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                🎯 Cerca y disponible
              </button>
              <button
                onClick={() => {
                  setSelectedRadius(50);
                  setSelectedService('all');
                  setShowAvailableOnly(false);
                  setSortBy('rating');
                }}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                ⭐ Mejor calificados
              </button>
              <button
                onClick={() => {
                  setSelectedRadius(50);
                  setSelectedService('all');
                  setShowAvailableOnly(false);
                  setSortBy('price');
                }}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                💰 Mejor precio
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1f2937', margin: 0 }}>
            {filteredProfessionals.length} profesionales encontrados
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}>
              📋 Lista
            </button>
            <button style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}>
              🗺️ Mapa
            </button>
          </div>
        </div>

        {/* Professionals Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProfessionals.map((professional) => (
            <div key={professional.id} style={{
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}>
              {/* Professional Header */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    fontSize: '3rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    width: '4rem',
                    height: '4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {professional.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.25rem' }}>
                      {professional.name}
                    </h3>
                    <p style={{ margin: '0.25rem 0', color: '#6b7280', fontWeight: '500' }}>
                      {professional.profession}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.125rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ 
                            color: i < Math.floor(professional.rating) ? '#fbbf24' : '#e5e7eb',
                            fontSize: '1rem'
                          }}>⭐</span>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {professional.rating} ({professional.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div style={{
                    background: professional.available ? '#dcfce7' : '#fef2f2',
                    color: professional.available ? '#16a34a' : '#dc2626',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {professional.available ? '✅ Disponible' : '⏰ Ocupado'}
                  </div>
                </div>

                <p style={{ color: '#6b7280', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                  {professional.description}
                </p>

                {/* Services */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: '0 0 0.5rem 0' }}>
                    Servicios:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {professional.services.map((service, index) => (
                      <span key={index} style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem'
                      }}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Professional Stats */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '0.5rem', 
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: '0.375rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>Experiencia</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                      {professional.experience}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>Respuesta</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                      {professional.responseTime}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>Trabajos</p>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                      {professional.completedJobs}
                    </p>
                  </div>
                </div>

                {/* Distance and Price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>📍</span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {professional.distance ? `${professional.distance.toFixed(1)} km de distancia` : 'Distancia no disponible'}
                    </span>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {professional.price}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleContactProfessional(professional)}
                    style={{
                      flex: 1,
                      background: professional.available ? '#2563eb' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      cursor: professional.available ? 'pointer' : 'not-allowed',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      fontSize: '0.875rem'
                    }}
                    onMouseOver={(e) => {
                      if (professional.available) {
                        e.target.style.background = '#1d4ed8';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (professional.available) {
                        e.target.style.background = '#2563eb';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                    disabled={!professional.available}
                  >
                    💬 {professional.available ? 'Contactar' : 'No disponible'}
                  </button>
                  
                  <button 
                    onClick={() => handleViewProfile(professional)}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '0.875rem'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#e5e7eb';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = '#f3f4f6';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    👁️ Ver perfil
                  </button>
                </div>

                {/* Quick Request Button for Clients */}
                {isClient() && professional.available && (
                  <button
                    onClick={() => handleRequestService(professional)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                      marginTop: '0.5rem',
                      transition: 'all 0.2s',
                      fontSize: '0.875rem'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    ⚡ Solicitar servicio ahora
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProfessionals.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>No se encontraron profesionales</h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Intenta ampliar el radio de búsqueda o cambiar los filtros
            </p>
            <button
              onClick={() => {
                setSelectedRadius(20);
                setSelectedService('all');
              }}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              🔄 Reiniciar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalsMapPage;