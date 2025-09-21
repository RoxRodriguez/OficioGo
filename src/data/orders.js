// Mock data structure for orders and requests in OficioGo
import { professionals } from './professionals';

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',           // Solicitud creada, esperando cotización
  QUOTED: 'quoted',            // Profesional envió cotización
  ACCEPTED: 'accepted',        // Cliente aceptó cotización
  IN_PROGRESS: 'in_progress',  // Trabajo en progreso
  COMPLETED: 'completed',      // Trabajo completado
  PAID: 'paid',               // Pago realizado
  RATED: 'rated',             // Servicio calificado
  CANCELLED: 'cancelled'       // Cancelado
};

// Service types
export const SERVICE_TYPES = {
  IMMEDIATE: 'immediate',      // Servicio inmediato
  SCHEDULED: 'scheduled'       // Servicio programado
};

// Mock orders data
export const orders = [
  {
    id: 1,
    clientId: 'user123',
    clientName: 'María González',
    professionalId: 1,
    professional: professionals[0], // Carlos Mendoza - Cerrajero
    serviceType: SERVICE_TYPES.IMMEDIATE,
    description: 'Apertura de puerta de departamento - llave quebrada adentro',
    location: {
      address: 'Av. Santa Fe 2830, Palermo, CABA',
      coordinates: { lat: -34.5881, lng: -58.4204 }
    },
    photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'],
    scheduledDate: null, // null for immediate service
    urgencyLevel: 'high',
    status: ORDER_STATUSES.RATED,
    createdAt: '2024-03-18T14:30:00Z',
    updatedAt: '2024-03-18T18:45:00Z',
    quotation: {
      amount: 3500,
      description: 'Apertura de cerradura + revisión del mecanismo',
      estimatedDuration: '30-45 minutos',
      sentAt: '2024-03-18T14:45:00Z',
      acceptedAt: '2024-03-18T14:50:00Z'
    },
    payment: {
      method: 'mock',
      amount: 3500,
      paidAt: '2024-03-18T17:30:00Z',
      transactionId: 'MOCK-TXN-001'
    },
    rating: {
      score: 5,
      comment: 'Excelente servicio, muy rápido y profesional. Llegó en 20 minutos.',
      ratedAt: '2024-03-18T18:45:00Z'
    },
    timeline: [
      { status: ORDER_STATUSES.PENDING, timestamp: '2024-03-18T14:30:00Z', note: 'Solicitud creada' },
      { status: ORDER_STATUSES.QUOTED, timestamp: '2024-03-18T14:45:00Z', note: 'Cotización enviada: $3,500' },
      { status: ORDER_STATUSES.ACCEPTED, timestamp: '2024-03-18T14:50:00Z', note: 'Cotización aceptada' },
      { status: ORDER_STATUSES.IN_PROGRESS, timestamp: '2024-03-18T15:20:00Z', note: 'Profesional en camino' },
      { status: ORDER_STATUSES.COMPLETED, timestamp: '2024-03-18T17:15:00Z', note: 'Trabajo completado' },
      { status: ORDER_STATUSES.PAID, timestamp: '2024-03-18T17:30:00Z', note: 'Pago procesado' },
      { status: ORDER_STATUSES.RATED, timestamp: '2024-03-18T18:45:00Z', note: 'Servicio calificado: 5 estrellas' }
    ]
  },
  {
    id: 2,
    clientId: 'user456',
    clientName: 'Roberto Silva',
    professionalId: 2,
    professional: professionals[1], // Miguel Rodríguez - Pintor
    serviceType: SERVICE_TYPES.SCHEDULED,
    description: 'Pintura de living y comedor - aproximadamente 40m²',
    location: {
      address: 'Corrientes 3500, Villa Crespo, CABA',
      coordinates: { lat: -34.6010, lng: -58.4380 }
    },
    photos: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'],
    scheduledDate: '2024-03-25T09:00:00Z',
    urgencyLevel: 'medium',
    status: ORDER_STATUSES.ACCEPTED,
    createdAt: '2024-03-20T10:15:00Z',
    updatedAt: '2024-03-20T11:30:00Z',
    quotation: {
      amount: 45000,
      description: 'Pintura completa living y comedor - incluye mano de obra y materiales base',
      estimatedDuration: '2-3 días',
      sentAt: '2024-03-20T10:45:00Z',
      acceptedAt: '2024-03-20T11:30:00Z'
    },
    payment: null,
    rating: null,
    timeline: [
      { status: ORDER_STATUSES.PENDING, timestamp: '2024-03-20T10:15:00Z', note: 'Solicitud creada' },
      { status: ORDER_STATUSES.QUOTED, timestamp: '2024-03-20T10:45:00Z', note: 'Cotización enviada: $45,000' },
      { status: ORDER_STATUSES.ACCEPTED, timestamp: '2024-03-20T11:30:00Z', note: 'Cotización aceptada - Programado para 25/03' }
    ]
  },
  {
    id: 3,
    clientId: 'user789',
    clientName: 'Ana López',
    professionalId: 3,
    professional: professionals[2], // Franco Giménez - Electricista
    serviceType: SERVICE_TYPES.IMMEDIATE,
    description: 'Problema con tablero eléctrico - se corta la luz constantemente',
    location: {
      address: 'Rivadavia 5200, Caballito, CABA',
      coordinates: { lat: -34.6180, lng: -58.4480 }
    },
    photos: [],
    scheduledDate: null,
    urgencyLevel: 'high',
    status: ORDER_STATUSES.QUOTED,
    createdAt: '2024-03-20T16:20:00Z',
    updatedAt: '2024-03-20T16:45:00Z',
    quotation: {
      amount: 8500,
      description: 'Revisión completa del tablero + reparación de térmica defectuosa',
      estimatedDuration: '1-2 horas',
      sentAt: '2024-03-20T16:45:00Z',
      acceptedAt: null
    },
    payment: null,
    rating: null,
    timeline: [
      { status: ORDER_STATUSES.PENDING, timestamp: '2024-03-20T16:20:00Z', note: 'Solicitud creada' },
      { status: ORDER_STATUSES.QUOTED, timestamp: '2024-03-20T16:45:00Z', note: 'Cotización enviada: $8,500' }
    ]
  }
];

// Helper functions for orders
export const getOrdersByClient = (clientId) => {
  return orders.filter(order => order.clientId === clientId);
};

export const getOrdersByProfessional = (professionalId) => {
  return orders.filter(order => order.professionalId === professionalId);
};

export const getOrderById = (orderId) => {
  return orders.find(order => order.id === parseInt(orderId));
};

export const getOrdersByStatus = (status) => {
  return orders.filter(order => order.status === status);
};

export const createOrder = (orderData) => {
  const newOrder = {
    id: orders.length + 1,
    ...orderData,
    status: ORDER_STATUSES.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        status: ORDER_STATUSES.PENDING,
        timestamp: new Date().toISOString(),
        note: 'Solicitud creada'
      }
    ]
  };
  
  orders.push(newOrder);
  return newOrder;
};

export const updateOrderStatus = (orderId, newStatus, note = '') => {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus;
    orders[orderIndex].updatedAt = new Date().toISOString();
    orders[orderIndex].timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Estado cambiado a ${newStatus}`
    });
    return orders[orderIndex];
  }
  return null;
};

export const addQuotation = (orderId, quotationData) => {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].quotation = {
      ...quotationData,
      sentAt: new Date().toISOString()
    };
    orders[orderIndex].status = ORDER_STATUSES.QUOTED;
    orders[orderIndex].updatedAt = new Date().toISOString();
    orders[orderIndex].timeline.push({
      status: ORDER_STATUSES.QUOTED,
      timestamp: new Date().toISOString(),
      note: `Cotización enviada: $${quotationData.amount.toLocaleString()}`
    });
    return orders[orderIndex];
  }
  return null;
};

export const acceptQuotation = (orderId) => {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].quotation.acceptedAt = new Date().toISOString();
    orders[orderIndex].status = ORDER_STATUSES.ACCEPTED;
    orders[orderIndex].updatedAt = new Date().toISOString();
    orders[orderIndex].timeline.push({
      status: ORDER_STATUSES.ACCEPTED,
      timestamp: new Date().toISOString(),
      note: 'Cotización aceptada'
    });
    return orders[orderIndex];
  }
  return null;
};

export const processPayment = (orderId, paymentData) => {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].payment = {
      ...paymentData,
      paidAt: new Date().toISOString(),
      transactionId: `MOCK-TXN-${Date.now()}`
    };
    orders[orderIndex].status = ORDER_STATUSES.PAID;
    orders[orderIndex].updatedAt = new Date().toISOString();
    orders[orderIndex].timeline.push({
      status: ORDER_STATUSES.PAID,
      timestamp: new Date().toISOString(),
      note: 'Pago procesado exitosamente'
    });
    return orders[orderIndex];
  }
  return null;
};

export const addRating = (orderId, ratingData) => {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].rating = {
      ...ratingData,
      ratedAt: new Date().toISOString()
    };
    orders[orderIndex].status = ORDER_STATUSES.RATED;
    orders[orderIndex].updatedAt = new Date().toISOString();
    orders[orderIndex].timeline.push({
      status: ORDER_STATUSES.RATED,
      timestamp: new Date().toISOString(),
      note: `Servicio calificado: ${ratingData.score} estrellas`
    });
    return orders[orderIndex];
  }
  return null;
};

// Status display helpers
export const getStatusDisplay = (status) => {
  const statusMap = {
    [ORDER_STATUSES.PENDING]: { label: 'Pendiente', color: 'yellow', icon: '⏳' },
    [ORDER_STATUSES.QUOTED]: { label: 'Cotización recibida', color: 'blue', icon: '💰' },
    [ORDER_STATUSES.ACCEPTED]: { label: 'Aceptada', color: 'green', icon: '✅' },
    [ORDER_STATUSES.IN_PROGRESS]: { label: 'En progreso', color: 'orange', icon: '🔧' },
    [ORDER_STATUSES.COMPLETED]: { label: 'Completada', color: 'purple', icon: '✨' },
    [ORDER_STATUSES.PAID]: { label: 'Pagada', color: 'green', icon: '💳' },
    [ORDER_STATUSES.RATED]: { label: 'Calificada', color: 'green', icon: '⭐' },
    [ORDER_STATUSES.CANCELLED]: { label: 'Cancelada', color: 'red', icon: '❌' }
  };
  
  return statusMap[status] || { label: status, color: 'gray', icon: '❓' };
};