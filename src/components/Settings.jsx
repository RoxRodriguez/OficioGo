import React, { useState } from 'react';
import { useAuth } from '../contexts/MockAuthContext';
import AuthNavbar from './AuthNavbar';
import { 
  FaCog, 
  FaBell, 
  FaMoon, 
  FaSun, 
  FaGlobe, 
  FaShield, 
  FaDatabase, 
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaDownload
} from 'react-icons/fa';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Notificaciones
    emailNotifications: true,
    pushNotifications: true,
    orderNotifications: true,
    messageNotifications: true,
    marketingEmails: false,
    
    // Apariencia
    darkMode: false,
    language: 'es',
    
    // Privacidad
    profileVisibility: 'public',
    showEmail: false,
    showPhone: true,
    
    // Otros
    autoSave: true,
    twoFactorAuth: false
  });

  const [success, setSuccess] = useState('');

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSelectChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    // Simular guardado de configuraciones
    setSuccess('Configuraciones guardadas correctamente');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExportData = () => {
    // Simular exportación de datos
    const data = JSON.stringify({
      user: user,
      settings: settings,
      exportDate: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mis-datos-oficiogo.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      alert('Funcionalidad de eliminación de cuenta - En desarrollo');
    }
  };

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 0',
      borderBottom: '1px solid #E5E7EB'
    }}>
      <div>
        <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            {description}
          </div>
        )}
      </div>
      <button
        onClick={onChange}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: checked ? '#10B981' : '#D1D5DB',
          transition: 'color 0.2s'
        }}
      >
        {checked ? <FaToggleOn /> : <FaToggleOff />}
      </button>
    </div>
  );

  const Section = ({ icon, title, children }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '1.5rem',
      overflow: 'hidden'
    }}>
      <div style={{
        background: '#F9FAFB',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ color: '#4A90E2', fontSize: '1.25rem' }}>{icon}</span>
        <h3 style={{ margin: 0, color: '#374151', fontSize: '1.125rem', fontWeight: '600' }}>
          {title}
        </h3>
      </div>
      <div style={{ padding: '0 1.5rem' }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <AuthNavbar />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
          overflow: 'hidden'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #4A90E2, #7BB3F0)', 
            color: 'white', 
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              <FaCog style={{ marginRight: '0.5rem' }} />
              Configuraciones
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              Personaliza tu experiencia en OficioGo
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div style={{
              background: '#D1FAE5',
              color: '#047857',
              padding: '1rem',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}
        </div>

        {/* Notificaciones */}
        <Section icon={<FaBell />} title="Notificaciones">
          <ToggleSwitch
            checked={settings.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
            label="Notificaciones por Email"
            description="Recibe actualizaciones importantes por correo electrónico"
          />
          <ToggleSwitch
            checked={settings.pushNotifications}
            onChange={() => handleToggle('pushNotifications')}
            label="Notificaciones Push"
            description="Recibe notificaciones en tiempo real en tu navegador"
          />
          <ToggleSwitch
            checked={settings.orderNotifications}
            onChange={() => handleToggle('orderNotifications')}
            label="Notificaciones de Pedidos"
            description="Recibe actualizaciones sobre el estado de tus pedidos"
          />
          <ToggleSwitch
            checked={settings.messageNotifications}
            onChange={() => handleToggle('messageNotifications')}
            label="Notificaciones de Mensajes"
            description="Recibe notificaciones de nuevos mensajes en el chat"
          />
          <ToggleSwitch
            checked={settings.marketingEmails}
            onChange={() => handleToggle('marketingEmails')}
            label="Emails de Marketing"
            description="Recibe ofertas especiales y noticias de OficioGo"
          />
        </Section>

        {/* Apariencia */}
        <Section icon={settings.darkMode ? <FaMoon /> : <FaSun />} title="Apariencia">
          <ToggleSwitch
            checked={settings.darkMode}
            onChange={() => handleToggle('darkMode')}
            label="Modo Oscuro"
            description="Cambia a un tema oscuro para reducir la fatiga visual"
          />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem 0',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                <FaGlobe style={{ marginRight: '0.5rem' }} />
                Idioma
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Selecciona tu idioma preferido
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleSelectChange('language', e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                background: 'white'
              }}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </Section>

        {/* Privacidad */}
        <Section icon={<FaShield />} title="Privacidad y Seguridad">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem 0',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Visibilidad del Perfil
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Controla quién puede ver tu perfil
              </div>
            </div>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSelectChange('profileVisibility', e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                background: 'white'
              }}
            >
              <option value="public">Público</option>
              <option value="private">Privado</option>
              <option value="contacts">Solo Contactos</option>
            </select>
          </div>

          <ToggleSwitch
            checked={settings.showEmail}
            onChange={() => handleToggle('showEmail')}
            label="Mostrar Email en Perfil"
            description="Permite que otros usuarios vean tu dirección de email"
          />
          <ToggleSwitch
            checked={settings.showPhone}
            onChange={() => handleToggle('showPhone')}
            label="Mostrar Teléfono en Perfil"
            description="Permite que otros usuarios vean tu número de teléfono"
          />
          <ToggleSwitch
            checked={settings.twoFactorAuth}
            onChange={() => handleToggle('twoFactorAuth')}
            label="Autenticación de Dos Factores"
            description="Agrega una capa extra de seguridad a tu cuenta"
          />
        </Section>

        {/* Datos y Almacenamiento */}
        <Section icon={<FaDatabase />} title="Datos y Almacenamiento">
          <ToggleSwitch
            checked={settings.autoSave}
            onChange={() => handleToggle('autoSave')}
            label="Guardado Automático"
            description="Guarda automáticamente tus cambios mientras trabajas"
          />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem 0',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Descargar Mis Datos
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Exporta una copia de todos tus datos
              </div>
            </div>
            <button
              onClick={handleExportData}
              style={{
                background: '#4A90E2',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <FaDownload /> Descargar
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem 0'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#EF4444', marginBottom: '0.25rem' }}>
                Eliminar Cuenta
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Elimina permanentemente tu cuenta y todos tus datos
              </div>
            </div>
            <button
              onClick={handleDeleteAccount}
              style={{
                background: '#EF4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <FaTrash /> Eliminar
            </button>
          </div>
        </Section>

        {/* Botón Guardar */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={handleSave}
            style={{
              background: '#10B981',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <FaSave /> Guardar Todas las Configuraciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;