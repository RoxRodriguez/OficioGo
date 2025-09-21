import React from 'react';

const TestApp = () => {
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🔧 OficioGo - Test Funcionando</h1>
      <p>Si ves este mensaje, React está funcionando correctamente!</p>
      <button onClick={() => alert('React funciona!')}>
        Probar interactividad
      </button>
    </div>
  );
};

export default TestApp;