import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Intentar cargar el tema guardado del localStorage
    const savedTheme = localStorage.getItem('oficiogo-theme');
    return savedTheme || 'light';
  });

  // Guardar el tema en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('oficiogo-theme', theme);
    
    // Aplicar clase al body para el tema global
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
  };

  // Definir colores del tema
  const themeColors = {
    light: {
      // Backgrounds
      background: '#f8fafc',
      cardBackground: '#ffffff',
      navbarBackground: '#ffffff',
      
      // Text
      textPrimary: '#374151',
      textSecondary: '#6B7280',
      textLight: '#9CA3AF',
      
      // Borders
      border: '#E5E7EB',
      borderLight: '#F3F4F6',
      
      // Status colors
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      
      // Gradients
      gradient: 'linear-gradient(135deg, #4A90E2, #7BB3F0)',
      gradientPurple: 'linear-gradient(135deg, #6B73FF, #9068FE)',
      
      // Shadows
      shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      shadowLarge: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
    dark: {
      // Backgrounds
      background: '#111827',
      cardBackground: '#1F2937',
      navbarBackground: '#1F2937',
      
      // Text
      textPrimary: '#F9FAFB',
      textSecondary: '#D1D5DB',
      textLight: '#9CA3AF',
      
      // Borders
      border: '#374151',
      borderLight: '#4B5563',
      
      // Status colors
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB',
      
      // Gradients
      gradient: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
      gradientPurple: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
      
      // Shadows
      shadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      shadowLarge: '0 10px 15px rgba(0, 0, 0, 0.3)',
    }
  };

  const currentTheme = themeColors[theme];

  const value = {
    theme,
    setTheme: setThemeMode,
    toggleTheme,
    colors: currentTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;