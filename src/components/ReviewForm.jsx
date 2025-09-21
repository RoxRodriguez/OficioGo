import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reviewCategories } from '../data/reviews';

const ReviewForm = ({ professionalId, orderId, onSubmit, onCancel }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    ratings: {
      overall: 0,
      quality: 0,
      punctuality: 0,
      professionalism: 0,
      value: 0,
      communication: 0
    },
    comment: '',
    serviceType: '',
    photos: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState([]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.ratings.overall === 0) {
      newErrors.overall = 'Debes proporcionar una calificación general';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'El comentario es obligatorio';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'El comentario debe tener al menos 10 caracteres';
    }

    if (!formData.serviceType.trim()) {
      newErrors.serviceType = 'Especifica el tipo de servicio recibido';
    }

    // Validate all rating categories
    Object.keys(reviewCategories).forEach(category => {
      if (formData.ratings[category] === 0) {
        newErrors[category] = `Califica ${reviewCategories[category].toLowerCase()}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRatingChange = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: rating
      }
    }));

    // Clear error for this category
    if (errors[category]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[category];
        return newErrors;
      });
    }

    // Update overall rating as average of all categories
    if (category !== 'overall') {
      const updatedRatings = {
        ...formData.ratings,
        [category]: rating
      };
      
      const categoryRatings = Object.keys(reviewCategories)
        .filter(key => key !== 'overall')
        .map(key => updatedRatings[key])
        .filter(r => r > 0);

      if (categoryRatings.length > 0) {
        const average = categoryRatings.reduce((sum, r) => sum + r, 0) / categoryRatings.length;
        setFormData(prev => ({
          ...prev,
          ratings: {
            ...updatedRatings,
            overall: Math.round(average)
          }
        }));
      }
    }
  };

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isImage && isValidSize;
    });

    if (validFiles.length + formData.photos.length > 5) {
      alert('Máximo 5 fotos permitidas');
      return;
    }

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...validFiles]
    }));
    
    setPhotoPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removePhoto = (index) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(photoPreviewUrls[index]);
    
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - in real app, this would upload photos and save review
      const reviewData = {
        ...formData,
        clientId: currentUser.id,
        clientName: currentUser.displayName || currentUser.email,
        clientAvatar: currentUser.photoURL || `https://ui-avatars.io/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email)}&background=0D8ABC&color=fff`,
        professionalId,
        orderId,
        date: new Date().toISOString(),
        isVerified: true, // Would be determined by actual service completion
        verificationMethod: 'confirmed_service',
        helpfulVotes: 0,
        reportCount: 0
      };

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onSubmit) {
        onSubmit(reviewData);
      }

      // Reset form
      setFormData({
        ratings: {
          overall: 0,
          quality: 0,
          punctuality: 0,
          professionalism: 0,
          value: 0,
          communication: 0
        },
        comment: '',
        serviceType: '',
        photos: []
      });
      setPhotoPreviewUrls([]);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error al enviar la reseña. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (category, currentRating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className={`text-2xl transition-colors ${
              star <= currentRating 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <p className="text-yellow-800">
          Debes iniciar sesión para dejar una reseña.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        Deja tu reseña
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de servicio recibido *
          </label>
          <input
            type="text"
            value={formData.serviceType}
            onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
            placeholder="Ej: Reparación de cerradura, Pintura de habitación..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.serviceType ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.serviceType && (
            <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>
          )}
        </div>

        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación general *
          </label>
          <div className="flex items-center space-x-3">
            {renderStarRating('overall', formData.ratings.overall)}
            <span className="text-gray-600">
              {formData.ratings.overall > 0 && (
                `${formData.ratings.overall}/5 estrella${formData.ratings.overall !== 1 ? 's' : ''}`
              )}
            </span>
          </div>
          {errors.overall && (
            <p className="text-red-500 text-sm mt-1">{errors.overall}</p>
          )}
        </div>

        {/* Detailed Ratings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Calificaciones detalladas *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(reviewCategories).filter(([key]) => key !== 'overall').map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  {errors[key] && (
                    <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                  )}
                </div>
                <div className="ml-4">
                  {renderStarRating(key, formData.ratings[key])}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu comentario *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            placeholder="Comparte tu experiencia con este profesional. ¿Cómo fue el servicio? ¿Qué destacarías?"
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
              errors.comment ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment && (
              <p className="text-red-500 text-sm">{errors.comment}</p>
            )}
            <p className="text-gray-500 text-sm text-right ml-auto">
              {formData.comment.length}/500 caracteres
            </p>
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotos del trabajo (opcional)
          </label>
          
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-2">
              <div className="text-4xl text-gray-400">📷</div>
              <div>
                <p className="text-gray-600">
                  Arrastra las fotos aquí o {' '}
                  <label className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                    selecciona archivos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Máximo 5 fotos, hasta 5MB cada una
                </p>
              </div>
            </div>
          </div>

          {/* Photo Previews */}
          {photoPreviewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {photoPreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">💡 Consejos para una buena reseña</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Sé específico sobre el servicio recibido</li>
            <li>• Menciona la puntualidad y profesionalismo</li>
            <li>• Incluye fotos del trabajo si es posible</li>
            <li>• Sé honesto pero constructivo</li>
            <li>• Ayuda a otros usuarios con tu experiencia</li>
          </ul>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Enviando...</span>
              </span>
            ) : (
              'Publicar reseña'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;