import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';
import mockApiService from '../services/mockApiService';

const ReviewSystemPage = () => {
  const { user, isClient } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Orden para calificar (viene desde OrderHistory)
  const orderToReview = location.state?.order;
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state para nueva review
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    wouldRecommend: true,
    punctuality: 5,
    quality: 5,
    communication: 5,
    cleanliness: 5
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await mockApiService.getReviews();
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading reviews:', error);
        alert('Error al cargar las reseñas. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (category, rating) => {
    setReviewForm(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!reviewForm.comment.trim()) {
      alert('Por favor, escribe un comentario sobre el servicio');
      setSubmitting(false);
      return;
    }

    try {
      // Enviar review usando el servicio API
      const reviewData = {
        orderId: orderToReview.id,
        professionalId: orderToReview.professionalId,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
        wouldRecommend: reviewForm.wouldRecommend,
        punctuality: reviewForm.punctuality,
        quality: reviewForm.quality,
        communication: reviewForm.communication,
        cleanliness: reviewForm.cleanliness
      };

      await mockApiService.createReview(user.id, reviewData);
      
      alert('¡Calificación enviada exitosamente! Gracias por tu feedback.');
      
      // Redirigir de vuelta a pedidos
      navigate('/orders');
      
    } catch (error) {
      console.error('Error al enviar review:', error);
      alert('Hubo un error al enviar la calificación. Por favor, intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, onRatingChange = null, category = null) => {
    return (
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={onRatingChange ? () => onRatingChange(category, star) : undefined}
            style={{
              fontSize: '1.5rem',
              color: star <= rating ? '#fbbf24' : '#d1d5db',
              cursor: onRatingChange ? 'pointer' : 'default',
              transition: 'color 0.2s'
            }}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div style={{
        background: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
          <p style={{ color: '#6b7280' }}>Cargando reseñas...</p>
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
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          ⭐ {orderToReview ? 'Calificar Servicio' : 'Sistema de Reseñas'}
        </h1>
        <p>
          {orderToReview 
            ? 'Comparte tu experiencia con otros usuarios'
            : 'Reseñas y calificaciones de servicios'
          }
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {orderToReview ? (
          /* Form para calificar servicio */
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {orderToReview.professionalAvatar}
              </div>
              <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
                Calificar servicio de {orderToReview.professionalName}
              </h2>
              <p style={{ color: '#6b7280' }}>{orderToReview.title}</p>
            </div>

            <form onSubmit={handleSubmitReview}>
              {/* Calificación General */}
              <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Calificación General</h3>
                {renderStars(reviewForm.rating, handleRatingChange, 'rating')}
                <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  {reviewForm.rating} de 5 estrellas
                </p>
              </div>

              {/* Calificaciones Detalladas */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '2rem' 
              }}>
                {[
                  { key: 'punctuality', label: 'Puntualidad' },
                  { key: 'quality', label: 'Calidad del Trabajo' },
                  { key: 'communication', label: 'Comunicación' },
                  { key: 'cleanliness', label: 'Limpieza' }
                ].map(aspect => (
                  <div key={aspect.key} style={{ textAlign: 'center' }}>
                    <h4 style={{ marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem' }}>
                      {aspect.label}
                    </h4>
                    {renderStars(reviewForm[aspect.key], handleRatingChange, aspect.key)}
                  </div>
                ))}
              </div>

              {/* Comentario */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Comentario sobre el servicio *
                </label>
                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleInputChange}
                  placeholder="Describe tu experiencia con el profesional, calidad del trabajo, puntualidad, etc."
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

              {/* Recomendación */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="wouldRecommend"
                    checked={reviewForm.wouldRecommend}
                    onChange={handleInputChange}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ color: '#374151', fontWeight: '500' }}>
                    Recomendaría este profesional a otros usuarios
                  </span>
                </label>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
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
                  disabled={submitting}
                  style={{
                    padding: '1rem 2rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Enviando...' : 'Enviar Calificación'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Lista de reseñas existentes */
          <div>
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>Reseñas Recientes</h2>
              <p style={{ color: '#6b7280' }}>
                Calificaciones y comentarios de servicios completados
              </p>
            </div>

            {reviews.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: '3rem',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
                <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>No hay reseñas disponibles</h3>
                <p style={{ color: '#6b7280' }}>
                  Las reseñas aparecerán aquí cuando los servicios sean completados
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {reviews.map(review => (
                  <div
                    key={review.id}
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: '1rem',
                      alignItems: 'start'
                    }}>
                      {/* Avatar */}
                      <div style={{
                        fontSize: '2rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        width: '3rem',
                        height: '3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {review.professionalAvatar}
                      </div>

                      {/* Review Content */}
                      <div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.125rem' }}>
                            {review.professionalName}
                          </h3>
                          <p style={{ margin: '0.25rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                            {review.professionalService} • {review.orderTitle}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                          {renderStars(review.rating)}
                          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            por {review.clientName}
                          </span>
                          {review.verified && (
                            <span style={{
                              background: '#16a34a',
                              color: 'white',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              ✓ Verificado
                            </span>
                          )}
                        </div>

                        <p style={{ margin: '0 0 1rem 0', color: '#374151', lineHeight: 1.6 }}>
                          "{review.comment}"
                        </p>

                        {/* Detailed Ratings */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                          gap: '0.5rem',
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          <div>Puntualidad: {renderStars(review.punctuality, null)}</div>
                          <div>Calidad: {renderStars(review.quality, null)}</div>
                          <div>Comunicación: {renderStars(review.communication, null)}</div>
                          <div>Limpieza: {renderStars(review.cleanliness, null)}</div>
                        </div>

                        {review.wouldRecommend && (
                          <div style={{
                            marginTop: '1rem',
                            color: '#16a34a',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}>
                            👍 Recomendado por el cliente
                          </div>
                        )}
                      </div>

                      {/* Date */}
                      <div style={{ textAlign: 'right', color: '#6b7280', fontSize: '0.75rem' }}>
                        {new Date(review.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystemPage;