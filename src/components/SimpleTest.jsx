import React from 'react';

const SimpleTest = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#2563eb', fontSize: '2rem', marginBottom: '1rem' }}>
        🎯 OficioGo - Prueba de Funcionamiento
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        ¡La aplicación está funcionando correctamente!
      </p>
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>✅ Estado del Sistema</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '0.5rem 0' }}>🔧 React: Funcionando</li>
          <li style={{ margin: '0.5rem 0' }}>🎨 CSS: Cargado</li>
          <li style={{ margin: '0.5rem 0' }}>🔄 Vite: Activo</li>
          <li style={{ margin: '0.5rem 0' }}>🚀 Servidor: Puerto 3000</li>
        </ul>
      </div>
      <button 
        style={{
          background: '#2563eb',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
        onClick={() => window.location.href = '/'}
      >
        🏠 Ir a la Aplicación Principal
      </button>
    </div>
  );
};

export default SimpleTest;