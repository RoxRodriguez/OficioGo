import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog, FaHistory, FaUserTie, FaShield } from 'react-icons/fa';
import { useAuth } from '../contexts/MockAuthContext';
import { USER_ROLES } from '../constants/userRoles';
import { NotificationBell } from './NotificationSystem';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout, switchRole, isProfessional, isClient, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleRoleSwitch = async (newRole) => {
    try {
      await switchRole(newRole);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error switching role:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            OficioGo
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link 
              to="/search" 
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Buscar
            </Link>
            
            {/* Role-based navigation */}
            {currentUser && (
              <>
                <Link 
                  to="/chat" 
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center space-x-1"
                >
                  <span>💬</span>
                  <span>Mensajes</span>
                </Link>
                
                {(isClient() || isAdmin()) && (
                  <Link 
                    to="/orders" 
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  >
                    Mis solicitudes
                  </Link>
                )}
                {(isProfessional() || isAdmin()) && (
                  <Link 
                    to="/professional-dashboard" 
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  >
                    Panel profesional
                  </Link>
                )}
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  >
                    Administración
                  </Link>
                )}
              </>
            )}
            
            {/* Notification Bell */}
            <NotificationBell />
            
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-primary-600" />
                    </div>
                  )}
                  <span className="font-medium">{userProfile?.displayName || 'Usuario'}</span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    userProfile?.role === USER_ROLES.ADMIN ? 'bg-red-100 text-red-700' :
                    userProfile?.role === USER_ROLES.PROFESSIONAL ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {userProfile?.role === USER_ROLES.ADMIN && <FaShield className="w-3 h-3" />}
                    {userProfile?.role === USER_ROLES.PROFESSIONAL && <FaUserTie className="w-3 h-3" />}
                    {userProfile?.role === USER_ROLES.CLIENT && <FaUser className="w-3 h-3" />}
                    <span className="capitalize">{userProfile?.role}</span>
                  </div>
                </button>
                
                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-900">{userProfile?.displayName}</div>
                      <div className="text-sm text-gray-500">{userProfile?.email}</div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaUser className="mr-3" />
                        Mi perfil
                      </Link>
                      
                      {isClient() && (
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FaHistory className="mr-3" />
                          Historial de pedidos
                        </Link>
                      )}
                      
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaCog className="mr-3" />
                        Configuración
                      </Link>
                    </div>
                    
                    {/* Role switching (demo feature) */}
                    <div className="border-t border-gray-200 py-2">
                      <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide">
                        Demo: Cambiar rol
                      </div>
                      {Object.values(USER_ROLES).map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleSwitch(role)}
                          className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                            userProfile?.role === role ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                          }`}
                        >
                          {role === USER_ROLES.ADMIN && <FaShield className="mr-3" />}
                          {role === USER_ROLES.PROFESSIONAL && <FaUserTie className="mr-3" />}
                          {role === USER_ROLES.CLIENT && <FaUser className="mr-3" />}
                          <span className="capitalize">{role}</span>
                        </button>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogin}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={handleLogin}
                  className="btn-primary"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/search" 
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Buscar
              </Link>
              
              {/* Role-based mobile navigation */}
              {currentUser && (
                <>
                  {(isClient() || isAdmin()) && (
                    <Link 
                      to="/orders" 
                      className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mis solicitudes
                    </Link>
                  )}
                  {(isProfessional() || isAdmin()) && (
                    <Link 
                      to="/professional-dashboard" 
                      className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel profesional
                    </Link>
                  )}
                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Administración
                    </Link>
                  )}
                </>
              )}
              
              {currentUser ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-3 py-2">
                    {userProfile?.photoURL ? (
                      <img
                        src={userProfile.photoURL}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-primary-600" />
                      </div>
                    )}
                    <div>
                      <div className="text-gray-900 font-medium">{userProfile?.displayName}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center space-x-1 ${
                        userProfile?.role === USER_ROLES.ADMIN ? 'bg-red-100 text-red-700' :
                        userProfile?.role === USER_ROLES.PROFESSIONAL ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {userProfile?.role === USER_ROLES.ADMIN && <FaShield className="w-3 h-3" />}
                        {userProfile?.role === USER_ROLES.PROFESSIONAL && <FaUserTie className="w-3 h-3" />}
                        {userProfile?.role === USER_ROLES.CLIENT && <FaUser className="w-3 h-3" />}
                        <span className="capitalize">{userProfile?.role}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser />
                    <span>Mi perfil</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors py-2 text-left"
                  >
                    <FaSignOutAlt />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleLogin();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2 text-left"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => {
                      handleLogin();
                      setIsMenuOpen(false);
                    }}
                    className="btn-primary w-full"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;