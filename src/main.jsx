import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

console.log('🚀 main.jsx ejecutándose...');
console.log('React disponible:', !!React);
console.log('ReactDOM disponible:', !!ReactDOM);

const rootElement = document.getElementById('root');
console.log('Elemento root encontrado:', !!rootElement);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  console.log('Root creado exitosamente');
  
  root.render(React.createElement(App));
  console.log('✅ App renderizada exitosamente');
} else {
  console.error('❌ No se encontró el elemento #root');
  document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 50px;">ERROR: No se encontró el elemento #root</h1>';
}