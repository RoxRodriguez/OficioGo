import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';

const AuthenticatedNavbar = () => {
  const { user, logout, isClient, isProfessional, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    // Usar navigate en lugar de window.location.href
    window.location.replace('/');
  };

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🔧</span>
        <Link to="/" style={{ color: '#2563eb', fontSize: '1.5rem', margin: 0, textDecoration: 'none' }}>
          OficioGo
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Navigation Links */}
        <Link to="/" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>
          Inicio
        </Link>

        {/* Mis Pedidos solo para usuarios autenticados */}
        {user && (
          <Link to="/orders" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>
            Mis Pedidos
          </Link>
        )}

        <Link to="/chat" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>
          💬 Chat
        </Link>
        
        {isProfessional() && (
          <>
            <Link to="/orders" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>
              Mis Trabajos
            </Link>
            <Link to="/profile" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>
              Mi Perfil
            </Link>
          </>
        )}

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {isProfessional() ? '🔧' : isAdmin() ? '⚙️' : '👤'}
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '0.5rem',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '0.5rem',
              minWidth: '200px',
              zIndex: 1000
            }}>
              <div style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>{user.displayName}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'capitalize' }}>
                  {user.role === 'client' ? 'Cliente' : user.role === 'professional' ? 'Profesional' : 'Administrador'}
                </div>
              </div>
              
              <button
                onClick={() => {/* TODO: Navigate to profile */}}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '0.25rem',
                  marginBottom: '0.25rem'
                }}
                onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                👤 Mi Perfil
              </button>
              
              <button
                onClick={() => {/* TODO: Navigate to settings */}}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '0.25rem',
                  marginBottom: '0.25rem'
                }}
                onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                ⚙️ Configuración
              </button>
              
              <div style={{ borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }}></div>
              
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '0.25rem',
                  color: '#dc2626'
                }}
                onMouseOver={(e) => e.target.style.background = '#fef2f2'}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const GuestNavbar = () => (
  <nav style={{
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1000
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '1.5rem' }}>🔧</span>
      <Link to="/" style={{ color: '#2563eb', fontSize: '1.5rem', margin: 0, textDecoration: 'none' }}>
        OficioGo
      </Link>
    </div>
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Link to="/" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>Inicio</Link>
      <Link to="/chat" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>💬 Chat</Link>
      <Link to="/login" style={{ 
        background: '#2563eb', 
        color: 'white', 
        textDecoration: 'none', 
        padding: '0.5rem 1rem', 
        borderRadius: '0.375rem' 
      }}>Iniciar Sesión</Link>
    </div>
  </nav>
);

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  
  return isAuthenticated() ? <AuthenticatedNavbar /> : <GuestNavbar />;
};

export default Navbar;