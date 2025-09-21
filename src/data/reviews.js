// Enhanced review system data structures for OficioGo
export const reviewCategories = {
  quality: 'Calidad del trabajo',
  punctuality: 'Puntualidad',
  professionalism: 'Profesionalismo',
  value: 'Relación calidad-precio',
  communication: 'Comunicación'
};

export const enhancedReviews = {
  1: [ // Carlos Mendoza - Cerrajero
    {
      id: 'rev_001',
      clientId: 'client_001',
      clientName: 'María González',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face',
      orderId: 'order_001',
      serviceType: 'Apertura de puerta',
      date: '2024-03-15T14:30:00Z',
      lastModified: '2024-03-15T15:00:00Z',
      isVerified: true,
      verificationMethod: 'confirmed_service',
      ratings: {
        overall: 5,
        quality: 5,
        punctuality: 5,
        professionalism: 5,
        value: 4,
        communication: 5
      },
      comment: 'Excelente servicio! Carlos llegó súper rápido, en solo 20 minutos después de llamar. Muy profesional, amable y el precio fue justo. Resolvió el problema de la cerradura bloqueada sin dañar la puerta. Lo recomiendo totalmente para emergencias.',
      photos: [
        {
          id: 'photo_001',
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
          caption: 'Cerradura reparada',
          uploadDate: '2024-03-15T15:00:00Z'
        }
      ],
      helpfulVotes: 12,
      reportCount: 0,
      professionalResponse: {
        id: 'response_001',
        date: '2024-03-15T18:30:00Z',
        message: 'Muchas gracias María por tu comentario! Me alegra haber podido ayudarte rápidamente. Siempre trato de brindar el mejor servicio posible. Cualquier cosa, no dudes en contactarme.',
        isEdited: false
      }
    },
    {
      id: 'rev_002',
      clientId: 'client_002',
      clientName: 'Roberto Silva',
      clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      orderId: 'order_002',
      serviceType: 'Cambio de cerraduras',
      date: '2024-03-10T09:15:00Z',
      lastModified: '2024-03-10T09:15:00Z',
      isVerified: true,
      verificationMethod: 'confirmed_service',
      ratings: {
        overall: 5,
        quality: 5,
        punctuality: 4,
        professionalism: 5,
        value: 5,
        communication: 5
      },
      comment: 'Muy recomendable! Carlos cambió 3 cerraduras en mi casa. Trabajo impecable, muy prolijo y precio súper justo. Llegó con todos los materiales necesarios y terminó más rápido de lo esperado.',
      photos: [
        {
          id: 'photo_002',
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          caption: 'Nuevas cerraduras instaladas',
          uploadDate: '2024-03-10T11:00:00Z'
        },
        {
          id: 'photo_003',
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
          caption: 'Detalle del trabajo terminado',
          uploadDate: '2024-03-10T11:00:00Z'
        }
      ],
      helpfulVotes: 8,
      reportCount: 0,
      professionalResponse: {
        id: 'response_002',
        date: '2024-03-10T14:20:00Z',
        message: 'Gracias Roberto! Fue un placer trabajar en tu casa. Las cerraduras que elegiste son de excelente calidad y te van a durar muchos años. ¡Saludos!',
        isEdited: false
      }
    },
    {
      id: 'rev_003',
      clientId: 'client_003',
      clientName: 'Ana López',
      clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      orderId: 'order_003',
      serviceType: 'Copia de llaves',
      date: '2024-03-08T16:45:00Z',
      lastModified: '2024-03-08T16:45:00Z',
      isVerified: true,
      verificationMethod: 'confirmed_service',
      ratings: {
        overall: 4,
        quality: 5,
        punctuality: 3,
        professionalism: 4,
        value: 4,
        communication: 4
      },
      comment: 'Buen servicio en general. El trabajo quedó perfecto y las llaves funcionan correctamente. Solo que llegó 30 minutos tarde de lo acordado, pero me avisó por WhatsApp. Precio razonable.',
      photos: [],
      helpfulVotes: 3,
      reportCount: 0,
      professionalResponse: {
        id: 'response_003',
        date: '2024-03-08T20:10:00Z',
        message: 'Hola Ana, muchas gracias por tu reseña. Lamento la demora, tuve un inconveniente con el tráfico que no pude prever. Siempre trato de ser puntual y me alegra que el trabajo haya quedado bien. ¡Gracias por la comprensión!',
        isEdited: false
      }
    },
    {
      id: 'rev_004',
      clientId: 'client_004',
      clientName: 'Diego Fernández',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      orderId: 'order_004',
      serviceType: 'Reparación de cerradura',
      date: '2024-02-28T11:20:00Z',
      lastModified: '2024-02-28T11:20:00Z',
      isVerified: true,
      verificationMethod: 'confirmed_service',
      ratings: {
        overall: 5,
        quality: 5,
        punctuality: 5,
        professionalism: 5,
        value: 4,
        communication: 5
      },
      comment: 'Excelente profesional! Mi cerradura estaba muy dañada y pensé que tendría que cambiarla completa, pero Carlos logró repararla perfectamente. Me ahorró mucho dinero. Súper recomendable.',
      photos: [
        {
          id: 'photo_004',
          url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
          caption: 'Cerradura reparada - antes y después',
          uploadDate: '2024-02-28T12:30:00Z'
        }
      ],
      helpfulVotes: 15,
      reportCount: 0,
      professionalResponse: null
    }
  ],
  2: [ // Miguel Rodríguez - Pintor
    {
      id: 'rev_005',
      clientId: 'client_005',
      clientName: 'Laura Martín',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face',
      orderId: 'order_005',
      serviceType: 'Pintura de departamento',
      date: '2024-03-12T10:00:00Z',
      lastModified: '2024-03-12T10:00:00Z',
      isVerified: true,
      verificationMethod: 'confirmed_service',
      ratings: {
        overall: 5,
        quality: 5,
        punctuality: 5,
        professionalism: 5,
        value: 5,
        communication: 5
      },
      comment: 'Increíble trabajo! Miguel pintó todo mi departamento de 2 ambientes en tiempo récord. Súper prolijo, protegió todos los muebles, limpió todo al terminar. El acabado quedó perfecto y cumplió exactamente con los tiempos acordados. 100% recomendable.',
      photos: [
        {
          id: 'photo_005',
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          caption: 'Living pintado - resultado final',
          uploadDate: '2024-03-12T18:00:00Z'
        },
        {
          id: 'photo_006',
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          caption: 'Dormitorio terminado',
          uploadDate: '2024-03-12T18:00:00Z'
        },
        {
          id: 'photo_007',
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
          caption: 'Detalle de la terminación',
          uploadDate: '2024-03-12T18:00:00Z'
        }
      ],
      helpfulVotes: 18,
      reportCount: 0,
      professionalResponse: {
        id: 'response_005',
        date: '2024-03-12T20:30:00Z',
        message: 'Muchas gracias Laura! Fue un placer trabajar en tu departamento. Me alegra que hayas quedado tan conforme con el resultado. El color que elegiste quedó hermoso. ¡Que lo disfrutes!',
        isEdited: false
      }
    },
    {
      id: 'rev_006',
      clientId: 'client_006',
      clientName: 'Jorge Pérez',
      clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      orderId: 'order_006',
      serviceType: 'Pintura exterior',
      date: '2024-03-05T08:30:00Z',
      lastModified: '2024-03-05T08:30:00Z',
      isVerified: true,
      verificationMethod: 'confirmed_service',
      ratings: {
        overall: 4,
        quality: 4,
        punctuality: 4,
        professionalism: 5,
        value: 3,
        communication: 4
      },
      comment: 'Buen trabajo en general. Miguel pintó la fachada de mi casa. El resultado quedó bien, aunque esperaba un acabado un poco mejor por el precio. Es muy profesional y educado. Cumplió con los tiempos.',
      photos: [
        {
          id: 'photo_008',
          url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
          caption: 'Fachada terminada',
          uploadDate: '2024-03-05T17:00:00Z'
        }
      ],
      helpfulVotes: 5,
      reportCount: 0,
      professionalResponse: {
        id: 'response_006',
        date: '2024-03-05T21:00:00Z',
        message: 'Gracias Jorge por tu comentario. Lamento que no haya cumplido completamente con tus expectativas. Si hay algo específico que no te conformó, no dudes en contactarme para solucionarlo. Siempre busco la satisfacción total de mis clientes.',
        isEdited: false
      }
    }
  ]
};

// Function to get reviews for a specific professional
export const getReviewsForProfessional = (professionalId) => {
  return enhancedReviews[professionalId] || [];
};

// Function to calculate detailed rating averages
export const calculateDetailedRatings = (professionalId) => {
  const reviews = getReviewsForProfessional(professionalId);
  
  if (reviews.length === 0) {
    return {
      overall: 0,
      quality: 0,
      punctuality: 0,
      professionalism: 0,
      value: 0,
      communication: 0,
      totalReviews: 0
    };
  }

  const totals = reviews.reduce((acc, review) => {
    acc.overall += review.ratings.overall;
    acc.quality += review.ratings.quality;
    acc.punctuality += review.ratings.punctuality;
    acc.professionalism += review.ratings.professionalism;
    acc.value += review.ratings.value;
    acc.communication += review.ratings.communication;
    return acc;
  }, {
    overall: 0,
    quality: 0,
    punctuality: 0,
    professionalism: 0,
    value: 0,
    communication: 0
  });

  const count = reviews.length;
  
  return {
    overall: Math.round((totals.overall / count) * 10) / 10,
    quality: Math.round((totals.quality / count) * 10) / 10,
    punctuality: Math.round((totals.punctuality / count) * 10) / 10,
    professionalism: Math.round((totals.professionalism / count) * 10) / 10,
    value: Math.round((totals.value / count) * 10) / 10,
    communication: Math.round((totals.communication / count) * 10) / 10,
    totalReviews: count
  };
};

// Function to get review statistics
export const getReviewStatistics = (professionalId) => {
  const reviews = getReviewsForProfessional(professionalId);
  
  const stats = {
    totalReviews: reviews.length,
    verifiedReviews: reviews.filter(r => r.isVerified).length,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    reviewsWithPhotos: reviews.filter(r => r.photos && r.photos.length > 0).length,
    reviewsWithResponses: reviews.filter(r => r.professionalResponse).length,
    helpfulVotesTotal: reviews.reduce((acc, r) => acc + r.helpfulVotes, 0)
  };

  if (reviews.length > 0) {
    stats.averageRating = reviews.reduce((acc, r) => acc + r.ratings.overall, 0) / reviews.length;
    
    reviews.forEach(review => {
      const rating = review.ratings.overall;
      stats.ratingDistribution[rating]++;
    });
  }

  return stats;
};

// Function to filter reviews
export const filterReviews = (professionalId, filters = {}) => {
  let reviews = getReviewsForProfessional(professionalId);

  if (filters.rating) {
    reviews = reviews.filter(r => r.ratings.overall === filters.rating);
  }

  if (filters.withPhotos) {
    reviews = reviews.filter(r => r.photos && r.photos.length > 0);
  }

  if (filters.verified) {
    reviews = reviews.filter(r => r.isVerified);
  }

  if (filters.withResponse) {
    reviews = reviews.filter(r => r.professionalResponse);
  }

  if (filters.serviceType) {
    reviews = reviews.filter(r => 
      r.serviceType.toLowerCase().includes(filters.serviceType.toLowerCase())
    );
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        reviews.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        reviews.sort((a, b) => b.ratings.overall - a.ratings.overall);
        break;
      case 'lowest':
        reviews.sort((a, b) => a.ratings.overall - b.ratings.overall);
        break;
      case 'helpful':
        reviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
        break;
      default:
        reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }

  return reviews;
};

export default {
  enhancedReviews,
  reviewCategories,
  getReviewsForProfessional,
  calculateDetailedRatings,
  getReviewStatistics,
  filterReviews
};