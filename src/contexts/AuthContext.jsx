import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

// User roles
export const USER_ROLES = {
  CLIENT: 'client',
  PROFESSIONAL: 'professional',
  ADMIN: 'admin'
};

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user profile in Firestore
  const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const { displayName, email, photoURL } = user;
      const { role = USER_ROLES.CLIENT, ...otherData } = additionalData;

      try {
        await setDoc(userRef, {
          displayName: displayName || email.split('@')[0],
          email,
          photoURL: photoURL || null,
          role,
          createdAt: new Date().toISOString(),
          isActive: true,
          isVerified: false,
          ...otherData
        });
      } catch (error) {
        console.error('Error creating user profile:', error);
      }
    }

    return getUserProfile(user.uid);
  };

  // Get user profile from Firestore
  const getUserProfile = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  // Sign up with email and password
  const signup = async (email, password, additionalData = {}) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (additionalData.displayName) {
        await updateProfile(result.user, {
          displayName: additionalData.displayName
        });
      }

      // Create user profile
      await createUserProfile(result.user, additionalData);
      
      return result;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  // Sign in with email and password
  const signin = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signinWithGoogle = async (role = USER_ROLES.CLIENT) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create or update user profile
      await createUserProfile(result.user, { role });
      
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (userId, updates) => {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, updates, { merge: true });
      
      // Refresh local profile
      const updatedProfile = await getUserProfile(userId);
      setUserProfile(updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  // Check if user is professional
  const isProfessional = () => hasRole(USER_ROLES.PROFESSIONAL);

  // Check if user is client
  const isClient = () => hasRole(USER_ROLES.CLIENT);

  // Check if user is admin
  const isAdmin = () => hasRole(USER_ROLES.ADMIN);

  // Switch user role (for demo purposes)
  const switchRole = async (newRole) => {
    if (!currentUser || !userProfile) return;
    
    try {
      await updateUserProfile(currentUser.uid, { role: newRole });
    } catch (error) {
      console.error('Error switching role:', error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Get user profile from Firestore
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    signin,
    signinWithGoogle,
    logout,
    updateUserProfile,
    hasRole,
    isProfessional,
    isClient,
    isAdmin,
    switchRole,
    USER_ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Mock auth for development (when Firebase is not configured)
export const MockAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock users for testing
  const mockUsers = {
    'client@test.com': {
      id: 'client123',
      email: 'client@test.com',
      displayName: 'Cliente Demo',
      role: USER_ROLES.CLIENT,
      photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face'
    },
    'professional@test.com': {
      id: 'prof123',
      email: 'professional@test.com',
      displayName: 'Profesional Demo',
      role: USER_ROLES.PROFESSIONAL,
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    'admin@test.com': {
      id: 'admin123',
      email: 'admin@test.com',
      displayName: 'Admin Demo',
      role: USER_ROLES.ADMIN,
      photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  };

  const signin = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers[email];
    if (user && password === 'demo123') {
      setCurrentUser({ uid: user.id, email: user.email, displayName: user.displayName });
      setUserProfile(user);
      return { user };
    } else {
      throw new Error('Credenciales inválidas');
    }
  };

  const signup = async (email, password, additionalData = {}) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {
      id: Date.now().toString(),
      email,
      displayName: additionalData.displayName || email.split('@')[0],
      role: additionalData.role || USER_ROLES.CLIENT,
      photoURL: null
    };

    setCurrentUser({ uid: user.id, email: user.email, displayName: user.displayName });
    setUserProfile(user);
    return { user };
  };

  const signinWithGoogle = async (role = USER_ROLES.CLIENT) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {
      id: 'google-' + Date.now(),
      email: 'google@demo.com',
      displayName: 'Usuario Google Demo',
      role,
      photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face'
    };

    setCurrentUser({ uid: user.id, email: user.email, displayName: user.displayName });
    setUserProfile(user);
    return { user };
  };

  const logout = async () => {
    setCurrentUser(null);
    setUserProfile(null);
  };

  const hasRole = (role) => userProfile?.role === role;
  const isProfessional = () => hasRole(USER_ROLES.PROFESSIONAL);
  const isClient = () => hasRole(USER_ROLES.CLIENT);
  const isAdmin = () => hasRole(USER_ROLES.ADMIN);

  const switchRole = async (newRole) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, role: newRole });
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    signin,
    signinWithGoogle,
    logout,
    updateUserProfile: () => {},
    hasRole,
    isProfessional,
    isClient,
    isAdmin,
    switchRole,
    USER_ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};