import React, { useState } from 'react';
import { useAuth } from '../contexts/MockAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthNavbar from './AuthNavbar';

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme, colors, isDark } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      profileVisible: true,
      locationVisible: false
    },
    preferences: {
      language: 'es',
      theme: theme // Usar el tema actual del contexto
    }
  });
  const [success, setSuccess] = useState('');

  const handleToggle = (section, key) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key]
      }
    }));
  };

  const handleSelectChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));

    // Si se cambia el tema, actualizar el contexto de tema
    if (section === 'preferences' && key === 'theme') {
      setTheme(value);
    }
  };

  const handleSave = () => {
    setSuccess('Configuraciones guardadas exitosamente');
    setTimeout(() => setSuccess(''), 3000);
  };

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 0',
      borderBottom: `1px solid ${colors.border}`
    }}>
      <span style={{ fontWeight: '500', color: colors.textPrimary }}>{label}</span>
      <button
        onClick={onChange}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          background: checked ? (isDark ? '#3B82F6' : '#4A90E2') : colors.border,
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'left 0.3s'
        }} />
      </button>
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ 
        color: colors.textPrimary, 
        fontSize: '1.2rem', 
        marginBottom: '1rem',
        borderBottom: `2px solid ${isDark ? '#3B82F6' : '#4A90E2'}`,
        paddingBottom: '0.5rem'
      }}>
        {title}
      </h3>
      <div style={{
        background: colors.cardBackground,
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden'
      }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ background: colors.background, minHeight: '100vh' }}>
      <AuthNavbar />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ 
          background: colors.cardBackground, 
          borderRadius: '12px', 
          boxShadow: colors.shadow,
          marginBottom: '2rem',
          overflow: 'hidden'
        }}>
          <div style={{ 
            background: colors.gradientPurple, 
            color: 'white', 
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              ⚙️ Configuración
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              Personaliza tu experiencia en OficioGo
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div style={{
              background: isDark ? '#064E3B' : '#D1FAE5',
              color: isDark ? '#34D399' : '#047857',
              padding: '1rem',
              textAlign: 'center'
            }}>
              ✅ {success}
            </div>
          )}
        </div>

        {/* Settings Content */}
        <div style={{ background: colors.background }}>
          {/* Notificaciones */}
          <Section title="📧 Notificaciones">
            <div style={{ padding: '1rem' }}>
              <ToggleSwitch
                checked={settings.notifications.email}
                onChange={() => handleToggle('notifications', 'email')}
                label="Notificaciones por Email"
              />
              <ToggleSwitch
                checked={settings.notifications.push}
                onChange={() => handleToggle('notifications', 'push')}
                label="Notificaciones Push"
              />
              <ToggleSwitch
                checked={settings.notifications.sms}
                onChange={() => handleToggle('notifications', 'sms')}
                label="Notificaciones SMS"
              />
            </div>
          </Section>

          {/* Privacidad */}
          <Section title="🔒 Privacidad">
            <div style={{ padding: '1rem' }}>
              <ToggleSwitch
                checked={settings.privacy.profileVisible}
                onChange={() => handleToggle('privacy', 'profileVisible')}
                label="Perfil visible para otros usuarios"
              />
              <ToggleSwitch
                checked={settings.privacy.locationVisible}
                onChange={() => handleToggle('privacy', 'locationVisible')}
                label="Compartir ubicación"
              />
            </div>
          </Section>

          {/* Preferencias */}
          <Section title="🎨 Preferencias">
            <div style={{ padding: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: `1px solid ${colors.border}`
              }}>
                <span style={{ fontWeight: '500', color: colors.textPrimary }}>Idioma</span>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handleSelectChange('preferences', 'language', e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    background: colors.cardBackground,
                    color: colors.textPrimary
                  }}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 0'
              }}>
                <span style={{ fontWeight: '500', color: colors.textPrimary }}>Tema</span>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => handleSelectChange('preferences', 'theme', e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    background: colors.cardBackground,
                    color: colors.textPrimary
                  }}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
            </div>
          </Section>

          {/* Botón de Guardar */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={handleSave}
              style={{
                background: colors.success,
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: colors.shadow,
                transition: 'transform 0.2s'
              }}
              className="theme-button"
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              💾 Guardar Todas las Configuraciones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;