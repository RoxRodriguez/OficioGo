import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import '../geometric-animations.css';

const AuthenticatedNavbar = () => {
  const { user, logout, isClient, isProfessional, isAdmin } = useAuth();
  const { colors, isDark } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    // Usar navigate en lugar de window.location.href
    window.location.replace('/');
  };

  return (
    <nav style={{
      background: colors.navbarBackground,
      boxShadow: colors.shadow,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      zIndex: 1000,
      borderBottom: `1px solid ${colors.border}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🔧</span>
        <Link to="/" style={{ 
          color: isDark ? '#60A5FA' : '#2563eb', 
          fontSize: '1.5rem', 
          margin: 0, 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          OficioGo
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Navigation Links */}
        <Link to="/" className="navbar-link">
          Inicio
        </Link>

        {/* Mis Pedidos solo para usuarios autenticados */}
        {user && (
          <Link to="/orders" className="navbar-link">
            Mis Pedidos
          </Link>
        )}

        <Link to="/chat" className="navbar-link">
          💬 Chat
        </Link>
        
        {isProfessional() && (
          <>
            <Link to="/orders" className="navbar-link">
              Mis Trabajos
            </Link>
            <Link to="/profile" className="navbar-link">
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
              background: colors.cardBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: '0.5rem',
              boxShadow: colors.shadowLarge,
              padding: '0.5rem',
              minWidth: '200px',
              zIndex: 1000
            }}>
              <div style={{ padding: '0.5rem', borderBottom: `1px solid ${colors.border}`, marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: '500', color: colors.textPrimary }}>{user.displayName}</div>
                <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>{user.email}</div>
                <div style={{ fontSize: '0.75rem', color: colors.textLight, textTransform: 'capitalize' }}>
                  {user.role === 'client' ? 'Cliente' : user.role === 'professional' ? 'Profesional' : 'Administrador'}
                </div>
              </div>
              
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/personal-profile');
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '0.25rem',
                  marginBottom: '0.25rem',
                  color: colors.textPrimary
                }}
                onMouseOver={(e) => e.target.style.background = colors.borderLight}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                👤 Mi Perfil
              </button>
              
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/settings');
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '0.25rem',
                  marginBottom: '0.25rem',
                  color: colors.textPrimary
                }}
                onMouseOver={(e) => e.target.style.background = colors.borderLight}
                onMouseOut={(e) => e.target.style.background = 'none'}
              >
                ⚙️ Configuración
              </button>
              
              <div style={{ borderTop: `1px solid ${colors.border}`, margin: '0.5rem 0' }}></div>
              
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
                  color: colors.error
                }}
                onMouseOver={(e) => e.target.style.background = isDark ? '#7F1D1D' : '#fef2f2'}
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
      <Link to="/" className="navbar-link">Inicio</Link>
      <Link to="/chat" className="navbar-link">💬 Chat</Link>
      <Link to="/login" className="navbar-primary-btn">Iniciar Sesión</Link>
    </div>
  </nav>
);

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  
  return isAuthenticated() ? <AuthenticatedNavbar /> : <GuestNavbar />;
};

export default Navbar;