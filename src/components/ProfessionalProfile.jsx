import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfessionalById } from '../data/professionals';
import ReviewSystem from './ReviewSystem';
import ReviewForm from './ReviewForm';
import { calculateDetailedRatings } from '../data/reviews';
import { useAuth } from '../contexts/AuthContext';
import { createNewConversation } from '../data/chat';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [detailedRatings, setDetailedRatings] = useState({});

  useEffect(() => {
    const prof = getProfessionalById(id);
    if (prof) {
      setProfessional(prof);
      // Load detailed ratings from the enhanced review system
      const ratings = calculateDetailedRatings(parseInt(id));
      setDetailedRatings(ratings);
    }
    setLoading(false);
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  const formatWorkingHours = (hours) => {
    const days = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };

    return Object.entries(hours).map(([day, time]) => (
      <div key={day} className="flex justify-between">
        <span className="font-medium">{days[day]}:</span>
        <span className={time === 'No disponible' ? 'text-gray-500' : 'text-gray-700'}>
          {time}
        </span>
      </div>
    ));
  };

  const handleRequestService = () => {
    navigate(`/request/${id}`);
  };

  const handleContactProfessional = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Create or find existing conversation
    const conversationId = createNewConversation(
      currentUser.id,
      parseInt(id),
      `Consulta sobre ${professional.profession}`
    );

    // Navigate to chat with this conversation
    navigate(`/chat?conversation=${conversationId}`);
  };

  const handleReviewSubmit = (reviewData) => {
    console.log('New review submitted:', reviewData);
    setShowReviewForm(false);
    
    // In a real app, this would:
    // 1. Send the review to the backend API
    // 2. Upload photos to cloud storage
    // 3. Update the professional's rating
    // 4. Refresh the reviews display
    
    // For now, we'll just show a success message
    alert('¡Reseña enviada exitosamente! Gracias por tu feedback.');
    
    // Refresh detailed ratings to reflect new review
    const updatedRatings = calculateDetailedRatings(parseInt(id));
    setDetailedRatings(updatedRatings);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">😕</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Profesional no encontrado
        </h3>
        <p className="text-gray-500 mb-6">
          El profesional que buscas no existe o ha sido eliminado.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="professional-profile max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={professional.profileImage}
              alt={professional.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 mx-auto md:mx-0"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {professional.name}
                  </h1>
                  {professional.isVerified && (
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                      ✓ Verificado
                    </span>
                  )}
                  <span className={`w-4 h-4 rounded-full ${professional.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>

                <p className="text-gray-600 text-lg mb-3 capitalize font-medium">
                  {professional.profession}
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="rating-stars">
                    {renderStars(detailedRatings.overall || professional.rating)}
                    <span className="ml-2 text-gray-600 font-medium">
                      {detailedRatings.overall || professional.rating} ({detailedRatings.totalReviews || professional.totalReviews} reseñas)
                    </span>
                  </div>
                  
                  {/* Quick rating breakdown */}
                  {detailedRatings.totalReviews > 0 && (
                    <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                      <span>Calidad: {detailedRatings.quality}★</span>
                      <span>Puntualidad: {detailedRatings.punctuality}★</span>
                      <span>Profesionalismo: {detailedRatings.professionalism}★</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-4">
                  {professional.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>📍 {professional.location.address}</span>
                  <span>📐 Radio: {professional.serviceRadius}km</span>
                  {professional.emergencyService && (
                    <span className="text-orange-600 font-medium">🚨 Emergencias</span>
                  )}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="text-center md:text-right">
                <div className="mb-4">
                  <p className="text-3xl font-bold text-primary-600">
                    ${professional.baseRate.toLocaleString()}
                  </p>
                  <p className="text-gray-500">Tarifa base</p>
                </div>

                <p className={`text-lg font-medium mb-4 ${professional.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {professional.isAvailable ? 'Disponible ahora' : 'No disponible'}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleRequestService}
                    disabled={!professional.isAvailable}
                    className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${
                      professional.isAvailable
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {professional.isAvailable ? 'Solicitar servicio' : 'No disponible'}
                  </button>

                  <button
                    onClick={handleContactProfessional}
                    className="w-full md:w-auto px-6 py-3 rounded-lg font-medium bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                  >
                    💬 Contactar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Información
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reseñas ({professional.reviews.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Skills */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {professional.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-primary-50 text-primary-700 px-3 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Horarios de trabajo</h3>
            <div className="space-y-2 text-sm">
              {formatWorkingHours(professional.workingHours)}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Review Form Toggle */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Reseñas y calificaciones
            </h3>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary"
            >
              {showReviewForm ? 'Cancelar' : 'Escribir reseña'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <ReviewForm
              professionalId={parseInt(id)}
              orderId={`order_${Date.now()}`} // Simulated order ID
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
            />
          )}

          {/* Enhanced Review System */}
          <ReviewSystem 
            professionalId={parseInt(id)}
            showFilters={true}
          />
        </div>
      )}

      {/* Request Service Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Solicitar servicio
            </h3>
            <p className="text-gray-600 mb-6">
              Esta funcionalidad estará disponible en la próxima versión. Por ahora, puedes contactar directamente al profesional.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 btn-secondary"
              >
                Cerrar
              </button>
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 btn-primary"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalProfile;