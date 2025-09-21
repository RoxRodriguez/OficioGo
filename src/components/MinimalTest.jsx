import React from 'react';

const MinimalTest = () => {
  return (
    <div>
      <h1>Hola Mundo - OficioGo</h1>
      <p>Si puedes ver esto, React está funcionando!</p>
      <button onClick={() => alert('¡Funciona!')}>
        Haz click aquí
      </button>
    </div>
  );
};

export default MinimalTest;