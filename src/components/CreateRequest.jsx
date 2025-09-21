import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfessionalById } from '../data/professionals';
import { createOrder, SERVICE_TYPES } from '../data/orders';
import { useNotification } from './NotificationSystem';

const CreateRequest = () => {
  const { professionalId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: SERVICE_TYPES.IMMEDIATE,
    description: '',
    location: '',
    urgencyLevel: 'medium',
    scheduledDate: '',
    scheduledTime: '',
    photos: [],
    notes: ''
  });

  React.useEffect(() => {
    const prof = getProfessionalById(professionalId);
    if (prof) {
      setProfessional(prof);
    } else {
      navigate('/');
    }
  }, [professionalId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, these would be uploaded to cloud storage
    // For now, we'll create mock URLs
    const mockUrls = files.map((file, index) => 
      `https://images.unsplash.com/photo-${Date.now()}-${index}?w=300&h=200&fit=crop`
    );
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...mockUrls]
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderData = {
        clientId: 'user123', // In real app, get from auth context
        clientName: 'Usuario Demo',
        professionalId: parseInt(professionalId),
        professional: professional,
        serviceType: formData.serviceType,
        description: formData.description,
        location: {
          address: formData.location,
          coordinates: { lat: -34.6037, lng: -58.3816 } // Mock coordinates
        },
        photos: formData.photos,
        scheduledDate: formData.serviceType === SERVICE_TYPES.SCHEDULED 
          ? `${formData.scheduledDate}T${formData.scheduledTime}:00Z` 
          : null,
        urgencyLevel: formData.urgencyLevel,
        notes: formData.notes
      };

      const newOrder = createOrder(orderData);
      
      // Show success notification
      addNotification({
        type: 'success',
        title: '¡Solicitud creada!',
        message: `Tu solicitud ha sido enviada a ${professional.name}. Recibirás una cotización pronto.`,
        action: {
          label: 'Ver solicitud',
          onClick: () => navigate(`/order/${newOrder.id}`)
        }
      });
      
      // Simulate professional sending quotation after 3 seconds
      setTimeout(() => {
        addNotification({
          type: 'order',
          title: 'Nueva cotización recibida',
          message: `${professional.name} te envió una cotización para tu solicitud.`,
          action: {
            label: 'Ver cotización',
            onClick: () => navigate(`/order/${newOrder.id}`)
          }
        });
      }, 3000);
      
      navigate(`/order/${newOrder.id}`);
      
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Hubo un error al crear la solicitud. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!professional) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-request max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/professional/${professionalId}`)}
          className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
        >
          ← Volver al perfil
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Solicitar servicio
        </h1>
        
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <img
            src={professional.profileImage}
            alt={professional.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{professional.name}</h3>
            <p className="text-gray-600 capitalize">{professional.profession}</p>
            <p className="text-primary-600 font-medium">
              Tarifa base: ${professional.baseRate.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Type */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tipo de servicio
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              formData.serviceType === SERVICE_TYPES.IMMEDIATE 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="serviceType"
                value={SERVICE_TYPES.IMMEDIATE}
                checked={formData.serviceType === SERVICE_TYPES.IMMEDIATE}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-2">🚀</div>
                <h4 className="font-medium text-gray-800">Inmediato</h4>
                <p className="text-sm text-gray-600">Lo antes posible</p>
              </div>
            </label>
            
            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              formData.serviceType === SERVICE_TYPES.SCHEDULED 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="serviceType"
                value={SERVICE_TYPES.SCHEDULED}
                checked={formData.serviceType === SERVICE_TYPES.SCHEDULED}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-2">📅</div>
                <h4 className="font-medium text-gray-800">Programado</h4>
                <p className="text-sm text-gray-600">Fecha específica</p>
              </div>
            </label>
          </div>
        </div>

        {/* Scheduled Date & Time */}
        {formData.serviceType === SERVICE_TYPES.SCHEDULED && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Fecha y hora preferida
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required={formData.serviceType === SERVICE_TYPES.SCHEDULED}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora
                </label>
                <input
                  type="time"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required={formData.serviceType === SERVICE_TYPES.SCHEDULED}
                />
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Descripción del trabajo
          </h3>
          
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe detalladamente qué necesitas que hagan..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Location */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Ubicación del servicio
          </h3>
          
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Dirección completa donde se realizará el trabajo"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Urgency Level */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Nivel de urgencia
          </h3>
          
          <select
            name="urgencyLevel"
            value={formData.urgencyLevel}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="low">Baja - Puedo esperar varios días</option>
            <option value="medium">Media - En los próximos días</option>
            <option value="high">Alta - Necesito resolverlo pronto</option>
            <option value="emergency">Emergencia - Urgente</option>
          </select>
        </div>

        {/* Photos */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Fotos (opcional)
          </h3>
          
          <div className="space-y-4">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <p className="text-sm text-gray-500 mt-2">
                Sube fotos para ayudar al profesional a entender mejor el trabajo
              </p>
            </label>
            
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Notas adicionales (opcional)
          </h3>
          
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Información adicional, horarios preferenciales, instrucciones especiales..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(`/professional/${professionalId}`)}
            className="flex-1 btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creando solicitud...
              </div>
            ) : (
              'Enviar solicitud'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;