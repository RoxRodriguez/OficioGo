import React, { useState } from 'react';
import { useAdvancedGeolocation } from '../hooks/useAdvancedGeolocation';

const GeolocationTest = () => {
  const { 
    location, 
    error, 
    loading, 
    getCurrentLocation, 
    calculateDistance,
    isLocationAvailable,
    isDefaultLocation 
  } = useAdvancedGeolocation();
  
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, result, status) => {
    setTestResults(prev => [...prev, { test, result, status, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runAllTests = () => {
    setTestResults([]);
    
    // Test 1: Verificar si la geolocalización está disponible
    if (navigator.geolocation) {
      addTestResult('Navigator Geolocation', 'API disponible', 'success');
    } else {
      addTestResult('Navigator Geolocation', 'API no disponible', 'error');
    }

    // Test 2: Verificar estado de ubicación
    if (isLocationAvailable) {
      addTestResult('Location Detection', `Lat: ${location.lat}, Lng: ${location.lng}`, 'success');
    } else {
      addTestResult('Location Detection', 'Ubicación no detectada', 'warning');
    }

    // Test 3: Verificar si es ubicación por defecto
    if (isDefaultLocation) {
      addTestResult('Default Location', 'Usando Buenos Aires por defecto', 'warning');
    } else {
      addTestResult('Default Location', 'Usando ubicación real del usuario', 'success');
    }

    // Test 4: Probar cálculo de distancia
    if (location) {
      const distance = calculateDistance(location.lat, location.lng, -34.6037, -58.3816);
      addTestResult('Distance Calculation', `${distance.toFixed(2)} km a centro BA`, 'success');
    } else {
      addTestResult('Distance Calculation', 'No se puede calcular sin ubicación', 'error');
    }

    // Test 5: Verificar precisión si está disponible
    if (location && location.accuracy) {
      addTestResult('Location Accuracy', `±${location.accuracy} metros`, 'info');
    } else {
      addTestResult('Location Accuracy', 'Precisión no disponible', 'warning');
    }
  };

  return (
    <div style={{
      background: '#f8fafc',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧪 Test de Geolocalización</h1>
        <p>Verificación completa del sistema de ubicación</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Status Panel */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>📍 Estado Actual</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{
              background: loading ? '#fef3c7' : (isLocationAvailable ? '#dcfce7' : '#fef2f2'),
              padding: '1rem',
              borderRadius: '0.375rem',
              border: `1px solid ${loading ? '#f59e0b' : (isLocationAvailable ? '#16a34a' : '#dc2626')}`
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Estado</h3>
              <p style={{ margin: 0, color: '#6b7280' }}>
                {loading ? '🔄 Detectando...' : (isLocationAvailable ? '✅ Ubicación activa' : '❌ Sin ubicación')}
              </p>
            </div>

            <div style={{
              background: '#f3f4f6',
              padding: '1rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Coordenadas</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'No disponible'}
              </p>
            </div>

            <div style={{
              background: error ? '#fef2f2' : '#f3f4f6',
              padding: '1rem',
              borderRadius: '0.375rem',
              border: `1px solid ${error ? '#dc2626' : '#d1d5db'}`
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Error</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                {error || 'Sin errores'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>🛠️ Controles</h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '🔄 Detectando...' : '📡 Obtener Ubicación'}
            </button>

            <button
              onClick={runAllTests}
              style={{
                background: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              🧪 Ejecutar Tests
            </button>

            <button
              onClick={() => setTestResults([])}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              🗑️ Limpiar Tests
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>📊 Resultados de Tests</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {testResults.map((result, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  background: result.status === 'success' ? '#dcfce7' : 
                             result.status === 'error' ? '#fef2f2' :
                             result.status === 'warning' ? '#fef3c7' : '#eff6ff',
                  border: `1px solid ${
                    result.status === 'success' ? '#16a34a' : 
                    result.status === 'error' ? '#dc2626' :
                    result.status === 'warning' ? '#f59e0b' : '#3b82f6'
                  }`
                }}>
                  <span style={{ 
                    fontSize: '1.25rem',
                    marginRight: '0.75rem'
                  }}>
                    {result.status === 'success' ? '✅' : 
                     result.status === 'error' ? '❌' :
                     result.status === 'warning' ? '⚠️' : 'ℹ️'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#1f2937' }}>{result.test}:</strong>
                    <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>{result.result}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {result.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo Professionals */}
        {location && (
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginTop: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>👥 Demo: Distancias a Profesionales</h2>
            
            {[
              { name: 'Juan Carlos (Plomero)', lat: -34.6037, lng: -58.3816 },
              { name: 'María González (Electricista)', lat: -34.5872, lng: -58.4019 },
              { name: 'Roberto Silva (Constructor)', lat: -34.6158, lng: -58.3734 }
            ].map((prof, index) => {
              const distance = calculateDistance(location.lat, location.lng, prof.lat, prof.lng);
              return (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: index < 2 ? '1px solid #e5e7eb' : 'none'
                }}>
                  <span style={{ color: '#1f2937' }}>{prof.name}</span>
                  <span style={{ color: '#2563eb', fontWeight: '500' }}>
                    {distance.toFixed(1)} km
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeolocationTest;