import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/MockAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthNavbar from './AuthNavbar';

const PersonalProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { colors, isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({
        ...formData,
        avatar: profileImage
      });
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setSuccess('Contraseña actualizada correctamente');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
    }
  };

  // Estilos reutilizables
  const inputStyle = (disabled = false) => ({
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: disabled ? colors.borderLight : colors.cardBackground,
    color: colors.textPrimary
  });

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: colors.textPrimary
  };

  return (
    <div style={{ background: colors.background, minHeight: '100vh' }}>
      <AuthNavbar />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ 
          background: colors.cardBackground, 
          borderRadius: '12px', 
          boxShadow: colors.shadow,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ 
            background: colors.gradient, 
            color: 'white', 
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              👤 Mi Perfil Personal
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              Administra tu información personal
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

          <div style={{ padding: '2rem' }}>
            {/* User Info Display */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: profileImage ? `url(${profileImage}) center/cover` : '#4A90E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  color: 'white',
                  margin: '0 auto',
                  border: '4px solid #4A90E2',
                  cursor: 'pointer'
                }}>
                  {!profileImage && '👤'}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    background: '#4A90E2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  �
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <h3 style={{ color: colors.textPrimary, marginTop: '1rem' }}>{user?.name || 'Usuario'}</h3>
              <p style={{ color: colors.textSecondary }}>{user?.role || 'Cliente'}</p>
            </div>

            {/* Form */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1.5rem' 
              }}>
                <h2 style={{ margin: 0, color: colors.textPrimary }}>Información Personal</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    background: isEditing ? colors.error : colors.info,
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {isEditing ? '❌ Cancelar' : '✏️ Editar'}
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: colors.textPrimary }}>
                      Nombre:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={inputStyle(!isEditing)}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={inputStyle(!isEditing)}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Teléfono:
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={inputStyle(!isEditing)}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Dirección:
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      style={inputStyle(!isEditing)}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                    <button
                      type="submit"
                      style={{
                        background: colors.success,
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      💾 Guardar Cambios
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Password Change Section */}
            <div style={{ marginTop: '2rem', borderTop: `1px solid ${colors.border}`, paddingTop: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1.5rem' 
              }}>
                <h2 style={{ margin: 0, color: colors.textPrimary }}>🔒 Cambiar Contraseña</h2>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  style={{
                    background: showPasswordForm ? colors.error : colors.textSecondary,
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {showPasswordForm ? '❌ Cancelar' : '🔑 Cambiar'}
                </button>
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit}>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>
                        Contraseña Actual:
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          style={{
                            ...inputStyle(),
                            paddingRight: '3rem'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem'
                          }}
                        >
                          {showCurrentPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Nueva Contraseña:
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength="6"
                          style={{
                            ...inputStyle(),
                            paddingRight: '3rem'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem'
                          }}
                        >
                          {showNewPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>
                        Confirmar Nueva Contraseña:
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        style={inputStyle()}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                    <button
                      type="submit"
                      style={{
                        background: colors.error,
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      🔑 Cambiar Contraseña
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;