import React, { useState, useEffect } from 'react';
import { 
  getReviewsForProfessional, 
  calculateDetailedRatings, 
  getReviewStatistics, 
  filterReviews,
  reviewCategories 
} from '../data/reviews';

const ReviewSystem = ({ professionalId, showFilters = true, maxReviews = null }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [detailedRatings, setDetailedRatings] = useState({});
  const [filters, setFilters] = useState({
    rating: null,
    withPhotos: false,
    verified: false,
    withResponse: false,
    serviceType: '',
    sortBy: 'newest'
  });
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);

  useEffect(() => {
    loadReviews();
  }, [professionalId]);

  useEffect(() => {
    applyFilters();
  }, [reviews, filters]);

  const loadReviews = () => {
    const allReviews = getReviewsForProfessional(professionalId);
    const stats = getReviewStatistics(professionalId);
    const ratings = calculateDetailedRatings(professionalId);
    
    setReviews(allReviews);
    setStatistics(stats);
    setDetailedRatings(ratings);
  };

  const applyFilters = () => {
    let filtered = filterReviews(professionalId, filters);
    
    if (maxReviews) {
      filtered = filtered.slice(0, maxReviews);
    }
    
    setFilteredReviews(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleExpandReview = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating, size = 'normal') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    const starClass = size === 'large' ? 'text-xl' : size === 'small' ? 'text-sm' : 'text-base';

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className={`text-yellow-400 ${starClass}`}>★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className={`text-yellow-400 ${starClass}`}>☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className={`text-gray-300 ${starClass}`}>☆</span>);
    }

    return stars;
  };

  const renderRatingBar = (category, rating, label) => {
    const percentage = (rating / 5) * 100;
    
    return (
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-sm text-gray-600 w-24 text-right">{label}</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-700 w-8">{rating}</span>
      </div>
    );
  };

  const PhotoModal = ({ photo, onClose }) => {
    if (!photo) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>
          <img
            src={photo.url}
            alt={photo.caption}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          {photo.caption && (
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded">
              <p className="text-center">{photo.caption}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="review-system">
      {/* Statistics Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {detailedRatings.overall || 0}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(detailedRatings.overall || 0, 'large')}
                </div>
                <div className="text-gray-600 text-sm">
                  {statistics.totalReviews} reseña{statistics.totalReviews !== 1 ? 's' : ''}
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-3">Distribución de calificaciones</h4>
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = statistics.ratingDistribution?.[rating] || 0;
                  const percentage = statistics.totalReviews > 0 ? (count / statistics.totalReviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center space-x-2 mb-1">
                      <span className="text-sm text-gray-600 w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Ratings */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Calificaciones detalladas</h4>
            {Object.entries(reviewCategories).map(([key, label]) => (
              <div key={key}>
                {renderRatingBar(key, detailedRatings[key] || 0, label)}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {statistics.verifiedReviews}
              </div>
              <div className="text-xs text-gray-600">Verificadas</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {statistics.reviewsWithPhotos}
              </div>
              <div className="text-xs text-gray-600">Con fotos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {statistics.reviewsWithResponses}
              </div>
              <div className="text-xs text-gray-600">Con respuesta</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {statistics.helpfulVotesTotal}
              </div>
              <div className="text-xs text-gray-600">Votos útiles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación
              </label>
              <select
                value={filters.rating || ''}
                onChange={(e) => handleFilterChange('rating', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">Todas</option>
                <option value="5">5 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="2">2 estrellas</option>
                <option value="1">1 estrella</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguas</option>
                <option value="highest">Mayor calificación</option>
                <option value="lowest">Menor calificación</option>
                <option value="helpful">Más útiles</option>
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de servicio
              </label>
              <input
                type="text"
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                placeholder="Buscar servicio..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.withPhotos}
                  onChange={(e) => handleFilterChange('withPhotos', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Con fotos</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Verificadas</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.withResponse}
                  onChange={(e) => handleFilterChange('withResponse', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Con respuesta</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No hay reseñas que coincidan con los filtros
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros para ver más reseñas
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const isExpanded = expandedReviews.has(review.id);
            const shouldTruncate = review.comment.length > 300;
            
            return (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={review.clientAvatar}
                      alt={review.clientName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-800">{review.clientName}</h4>
                        {review.isVerified && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            🛡️ Verificada
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">
                          {renderStars(review.ratings.overall)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      Servicio: <span className="font-medium">{review.serviceType}</span>
                    </div>
                    {review.helpfulVotes > 0 && (
                      <div className="text-xs text-gray-500">
                        👍 {review.helpfulVotes} útil{review.helpfulVotes !== 1 ? 'es' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Ratings */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  {Object.entries(reviewCategories).map(([key, label]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-gray-600 mb-1">{label}</div>
                      <div className="flex justify-center">
                        {renderStars(review.ratings[key], 'small')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Review Comment */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {shouldTruncate && !isExpanded 
                      ? `${review.comment.substring(0, 300)}...`
                      : review.comment
                    }
                  </p>
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpandReview(review.id)}
                      className="text-primary-600 hover:text-primary-700 text-sm mt-2"
                    >
                      {isExpanded ? 'Ver menos' : 'Ver más'}
                    </button>
                  )}
                </div>

                {/* Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {review.photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative cursor-pointer group"
                          onClick={() => setSelectedPhotoModal(photo)}
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-24 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-2xl">🔍</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional Response */}
                {review.professionalResponse && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">P</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-blue-800">Respuesta del profesional</span>
                          <span className="text-xs text-blue-600">
                            {formatDate(review.professionalResponse.date)}
                          </span>
                          {review.professionalResponse.isEdited && (
                            <span className="text-xs text-blue-500">(editada)</span>
                          )}
                        </div>
                        <p className="text-blue-700 text-sm leading-relaxed">
                          {review.professionalResponse.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center space-x-1">
                      <span>👍</span>
                      <span>Útil ({review.helpfulVotes})</span>
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">
                      Reportar
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {review.orderId}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Photo Modal */}
      <PhotoModal 
        photo={selectedPhotoModal}
        onClose={() => setSelectedPhotoModal(null)}
      />
    </div>
  );
};

export default ReviewSystem;