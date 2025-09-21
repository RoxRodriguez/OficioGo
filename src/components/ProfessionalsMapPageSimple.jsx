import React from 'react';
import { useAuth } from '../contexts/MockAuthContext';

const ProfessionalsMapPageSimple = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Buscar Profesionales
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Página de profesionales funcionando.</p>
          <p>Usuario actual: {user?.displayName || user?.name || 'No autenticado'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsMapPageSimple;