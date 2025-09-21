import React from 'react';

const BasicHome = () => {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        color: '#2563eb', 
        fontSize: '3rem', 
        marginBottom: '2rem' 
      }}>
        🔧 OficioGo
      </h1>
      
      <p style={{ 
        fontSize: '1.5rem', 
        color: '#374151',
        marginBottom: '3rem' 
      }}>
        Encuentra profesionales de confianza cerca de ti
      </p>

      <div style={{
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        borderRadius: '1rem',
        marginBottom: '2rem',
        maxWidth: '600px',
        margin: '0 auto 2rem auto'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
          🚀 Aplicación Funcionando
        </h2>
        <p style={{ color: '#6b7280' }}>
          La aplicación OficioGo está lista y operativa
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: '#eff6ff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
          <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Electricistas</h3>
          <p style={{ color: '#6b7280' }}>Instalaciones y reparaciones eléctricas</p>
        </div>

        <div style={{
          backgroundColor: '#eff6ff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔧</div>
          <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Plomeros</h3>
          <p style={{ color: '#6b7280' }}>Reparaciones de plomería y destapes</p>
        </div>

        <div style={{
          backgroundColor: '#eff6ff',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐</div>
          <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Cerrajeros</h3>
          <p style={{ color: '#6b7280' }}>Servicios de cerrajería 24/7</p>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <button 
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
          onClick={() => window.location.href = '/simple-test'}
        >
          🧪 Página de Prueba
        </button>
        
        <button 
          style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = '/chat'}
        >
          💬 Ir al Chat
        </button>
      </div>
    </div>
  );
};

export default BasicHome;