import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';
import mockApiService from '../services/mockApiService';

const CreateRequestPage = () => {
  const { user, isClient } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Datos del profesional pre-seleccionado (si viene del mapa)
  const selectedProfessional = location.state?.selectedProfessional;
  
  const [formData, setFormData] = useState({
    serviceType: selectedProfessional?.service || '',
    professionalId: selectedProfessional?.id || '',
    title: '',
    description: '',
    urgency: 'normal',
    budget: '',
    preferredDate: '',
    preferredTime: '',
    address: '',
    additionalNotes: ''
  });

  const [loading, setLoading] = useState(false);
  
  const serviceTypes = [
    { value: 'Plomería', label: '🔧 Plomería', icon: '🔧' },
    { value: 'Electricidad', label: '⚡ Electricidad', icon: '⚡' },
    { value: 'Pintura', label: '🎨 Pintura', icon: '🎨' },
    { value: 'Carpintería', label: '🪚 Carpintería', icon: '🪚' },
    { value: 'Jardinería', label: '🌱 Jardinería', icon: '🌱' },
    { value: 'Limpieza', label: '🧽 Limpieza', icon: '🧽' }
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Baja - En los próximos días', color: '#16a34a' },
    { value: 'normal', label: 'Normal - Esta semana', color: '#ea580c' },
    { value: 'high', label: 'Alta - Dentro de 24 horas', color: '#dc2626' },
    { value: 'urgent', label: 'Urgente - Lo antes posible', color: '#7c2d12' }
  ];

  useEffect(() => {
    if (!user || !isClient()) {
      alert('Debes iniciar sesión como cliente para crear solicitudes');
      navigate('/login');
      return;
    }
  }, [user, isClient, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones básicas
    if (!formData.title.trim()) {
      alert('Por favor, proporciona un título para tu solicitud');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      alert('Por favor, describe detalladamente el trabajo que necesitas');
      setLoading(false);
      return;
    }

    if (!formData.address.trim()) {
      alert('Por favor, proporciona la dirección donde se realizará el trabajo');
      setLoading(false);
      return;
    }

    try {
      // Crear solicitud usando el servicio API
      const orderData = {
        title: formData.title,
        description: formData.description,
        serviceType: formData.serviceType,
        urgency: formData.urgency,
        budget: parseFloat(formData.budget) || 0,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        address: formData.address,
        additionalNotes: formData.additionalNotes,
        professionalId: formData.professionalId || null
      };

      const newOrder = await mockApiService.createOrder(user.id, orderData);
      
      // Mostrar mensaje de éxito
      alert('¡Solicitud creada exitosamente! Te notificaremos cuando un profesional la acepte.');
      
      // Redirigir a mis pedidos
      navigate('/orders');
      
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      alert('Hubo un error al crear la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        background: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h2 style={{ color: '#1f2937', marginBottom: '1rem' }}>Acceso requerido</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Necesitas iniciar sesión como cliente para crear solicitudes de servicio
          </p>
          <button 
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝 Crear Solicitud de Servicio</h1>
        <p>Describe tu proyecto y encuentra al profesional ideal</p>
        {selectedProfessional && (
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginTop: '1rem',
            display: 'inline-block'
          }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
              {selectedProfessional.avatar}
            </span>
            Solicitud dirigida a: <strong>{selectedProfessional.name}</strong>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {/* Tipo de Servicio */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Tipo de Servicio *
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            >
              <option value="">Selecciona un tipo de servicio</option>
              {serviceTypes.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Título del Proyecto *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ej: Reparación de tubería en baño principal"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Descripción Detallada *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe detalladamente el trabajo que necesitas, materiales incluidos, accesibilidad, etc."
              required
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Urgencia */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Nivel de Urgencia
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {urgencyOptions.map(option => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    border: formData.urgency === option.value ? `2px solid ${option.color}` : '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    background: formData.urgency === option.value ? `${option.color}10` : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={option.value}
                    checked={formData.urgency === option.value}
                    onChange={handleInputChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ color: option.color, fontWeight: '500' }}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Presupuesto */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Presupuesto Estimado
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="Presupuesto en pesos argentinos"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Fecha y Hora Preferida */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem', 
            marginBottom: '1.5rem' 
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Fecha Preferida
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Hora Preferida
              </label>
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Dirección */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Dirección del Trabajo *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Dirección completa donde se realizará el trabajo"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Notas Adicionales */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Notas Adicionales
            </label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              placeholder="Información adicional, restricciones de horario, instrucciones especiales, etc."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: '1rem 2rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                background: 'white',
                color: '#374151',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creando...' : 'Crear Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestPage;