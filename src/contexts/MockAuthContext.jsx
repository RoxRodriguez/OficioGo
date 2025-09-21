import React, { createContext, useContext, useState, useEffect } from 'react';
import mockApiService from '../services/mockApiService';
import { USER_ROLES } from '../constants/userRoles';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(true);

  // Mock users database
  const mockUsers = [
    {
      uid: '1',
      email: 'cliente@test.com',
      displayName: 'Cliente Test',
      role: USER_ROLES.CLIENT,
      profile: {
        phone: '+54 11 1234-5678',
        address: 'Buenos Aires, Argentina'
      }
    },
    {
      uid: '2',
      email: 'profesional@test.com',
      displayName: 'Profesional Test',
      role: USER_ROLES.PROFESSIONAL,
      profile: {
        phone: '+54 11 8765-4321',
        address: 'CABA, Argentina',
        profession: 'Plomero',
        experience: '5 años',
        description: 'Especialista en reparaciones de plomería residencial y comercial'
      }
    },
    {
      uid: '3',
      email: 'admin@test.com',
      displayName: 'Admin Test',
      role: USER_ROLES.ADMIN,
      profile: {
        phone: '+54 11 0000-0000',
        address: 'Sistema'
      }
    }
  ];

  // Mock login function
  const login = async (email, password) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = await mockApiService.getUserByEmail(email);
      
      if (foundUser && password === '123456') {
        const userWithAuth = {
          ...foundUser,
          uid: foundUser.id.toString(),
          displayName: foundUser.name,
          customRole: foundUser.role
        };
        
        setUser(userWithAuth);
        localStorage.setItem('mockUser', JSON.stringify(userWithAuth));
        setLoading(false);
        return { success: true, user: userWithAuth };
      } else {
        setLoading(false);
        throw new Error('Email o contraseña incorrectos');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Mock register function
  const register = async (email, password, displayName, role = USER_ROLES.CLIENT) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setLoading(false);
      throw new Error('El email ya está registrado');
    }
    
    const newUser = {
      uid: Date.now().toString(),
      email,
      displayName,
      role,
      profile: {
        phone: '',
        address: '',
        ...(role === USER_ROLES.PROFESSIONAL && {
          profession: '',
          experience: '',
          description: ''
        })
      }
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    setLoading(false);
    
    return { success: true, user: newUser };
  };

  // Mock logout function
  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('mockUser');
    setLoading(false);
  };

  // Mock update profile function
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedUser = {
      ...user,
      profile: { ...user.profile, ...profileData }
    };
    
    setUser(updatedUser);
    localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    setLoading(false);
    
    return updatedUser;
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('mockUser');
      }
    }
    setInitialized(true);
  }, []);

  // Helper functions
  const isClient = () => user?.customRole === USER_ROLES.CLIENT || user?.role === USER_ROLES.CLIENT;
  const isProfessional = () => user?.customRole === USER_ROLES.PROFESSIONAL || user?.role === USER_ROLES.PROFESSIONAL;
  const isAdmin = () => user?.customRole === USER_ROLES.ADMIN || user?.role === USER_ROLES.ADMIN;
  const isAuthenticated = () => !!user;

  const value = {
    user,
    login,
    register,
    logout,
    updateUserProfile,
    loading,
    initialized,
    isClient,
    isProfessional,
    isAdmin,
    isAuthenticated,
    USER_ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook - definido aquí para evitar problemas de Fast Refresh
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export everything at the end
export { AuthProvider };
export default AuthProvider;