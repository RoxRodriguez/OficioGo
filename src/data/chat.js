// Chat system data structures and mock data for OficioGo
import { v4 as uuidv4 } from 'uuid';

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  DOCUMENT: 'document',
  LOCATION: 'location',
  SYSTEM: 'system'
};

// Message status
export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
};

// Conversation status
export const CONVERSATION_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  BLOCKED: 'blocked'
};

// Mock conversations data
export const conversations = {
  'conv_001': {
    id: 'conv_001',
    participants: ['client_001', 'prof_001'], // client_001 (María González) <-> prof_001 (Carlos Mendoza)
    professionalId: 1,
    clientId: 'client_001',
    orderId: 'order_001',
    serviceType: 'Cerrajería',
    status: CONVERSATION_STATUS.ACTIVE,
    createdAt: '2024-03-15T10:00:00Z',
    lastActivity: '2024-03-15T16:30:00Z',
    unreadCount: {
      'client_001': 0,
      'prof_001': 2
    },
    lastMessage: {
      id: 'msg_015',
      senderId: 'client_001',
      content: '¡Muchas gracias Carlos! Excelente trabajo como siempre',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T16:30:00Z'
    }
  },
  'conv_002': {
    id: 'conv_002',
    participants: ['client_002', 'prof_002'], // client_002 (Roberto Silva) <-> prof_002 (Miguel Rodríguez)
    professionalId: 2,
    clientId: 'client_002',
    orderId: 'order_005',
    serviceType: 'Pintura',
    status: CONVERSATION_STATUS.ACTIVE,
    createdAt: '2024-03-12T08:00:00Z',
    lastActivity: '2024-03-12T19:45:00Z',
    unreadCount: {
      'client_002': 1,
      'prof_002': 0
    },
    lastMessage: {
      id: 'msg_025',
      senderId: 'prof_002',
      content: 'Perfecto Roberto! Nos vemos mañana a las 8:00 AM. Llevaré todos los materiales.',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-12T19:45:00Z'
    }
  },
  'conv_003': {
    id: 'conv_003',
    participants: ['client_003', 'prof_001'], // client_003 (Ana López) <-> prof_001 (Carlos Mendoza)
    professionalId: 1,
    clientId: 'client_003',
    orderId: 'order_003',
    serviceType: 'Copia de llaves',
    status: CONVERSATION_STATUS.ACTIVE,
    createdAt: '2024-03-08T14:00:00Z',
    lastActivity: '2024-03-08T17:20:00Z',
    unreadCount: {
      'client_003': 0,
      'prof_001': 0
    },
    lastMessage: {
      id: 'msg_012',
      senderId: 'prof_001',
      content: 'De nada Ana! Cualquier cosa no dudes en contactarme',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-08T17:20:00Z'
    }
  }
};

// Mock messages data
export const messages = {
  'conv_001': [
    {
      id: 'msg_001',
      conversationId: 'conv_001',
      senderId: 'client_001',
      content: 'Hola Carlos! Necesito ayuda con mi puerta principal, no puedo abrirla',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T10:00:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['prof_001'],
      readAt: '2024-03-15T10:05:00Z'
    },
    {
      id: 'msg_002',
      conversationId: 'conv_001',
      senderId: 'prof_001',
      content: '¡Hola María! No te preocupes, te ayudo enseguida. ¿Es una cerradura que se trabó o la llave se rompió?',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T10:05:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['client_001'],
      readAt: '2024-03-15T10:06:00Z'
    },
    {
      id: 'msg_003',
      conversationId: 'conv_001',
      senderId: 'client_001',
      content: 'La cerradura se trabó completamente, no gira para ningún lado',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T10:06:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['prof_001'],
      readAt: '2024-03-15T10:07:00Z'
    },
    {
      id: 'msg_004',
      conversationId: 'conv_001',
      senderId: 'client_001',
      content: 'https://maps.google.com/?q=-34.5875,-58.4225',
      type: MESSAGE_TYPES.LOCATION,
      timestamp: '2024-03-15T10:08:00Z',
      status: MESSAGE_STATUS.READ,
      metadata: {
        latitude: -34.5875,
        longitude: -58.4225,
        address: 'Av. Santa Fe 3500, Palermo, CABA'
      },
      readBy: ['prof_001'],
      readAt: '2024-03-15T10:09:00Z'
    },
    {
      id: 'msg_005',
      conversationId: 'conv_001',
      senderId: 'prof_001',
      content: 'Perfecto, veo tu ubicación. Estoy cerca, puedo estar ahí en 15-20 minutos. El costo del servicio sería $2,500.',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T10:10:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['client_001'],
      readAt: '2024-03-15T10:11:00Z'
    },
    {
      id: 'msg_006',
      conversationId: 'conv_001',
      senderId: 'client_001',
      content: 'Perfecto Carlos! Te espero. ¿Necesitas que baje o puedes tocar el portero?',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T10:12:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['prof_001'],
      readAt: '2024-03-15T10:13:00Z'
    },
    {
      id: 'msg_007',
      conversationId: 'conv_001',
      senderId: 'prof_001',
      content: 'Toco el portero cuando llegue. ¡Voy en camino! 🚗',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T10:15:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['client_001'],
      readAt: '2024-03-15T10:16:00Z'
    },
    {
      id: 'msg_008',
      conversationId: 'conv_001',
      senderId: 'prof_001',
      content: 'Ya llegué! Estoy en la puerta del edificio',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T10:35:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['client_001'],
      readAt: '2024-03-15T10:36:00Z'
    },
    {
      id: 'msg_009',
      conversationId: 'conv_001',
      senderId: 'prof_001',
      content: 'https://example.com/image/cerradura_reparada.jpg',
      type: MESSAGE_TYPES.IMAGE,
      timestamp: '2024-03-15T11:15:00Z',
      status: MESSAGE_STATUS.READ,
      metadata: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        caption: 'Cerradura reparada y funcionando perfectamente',
        fileName: 'cerradura_reparada.jpg',
        fileSize: 245680
      },
      readBy: ['client_001'],
      readAt: '2024-03-15T11:16:00Z'
    },
    {
      id: 'msg_010',
      conversationId: 'conv_001',
      senderId: 'prof_001',
      content: 'Listo María! Ya está reparada. Era solo un problema de lubricación en el mecanismo interno.',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T11:16:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['client_001'],
      readAt: '2024-03-15T11:17:00Z'
    },
    {
      id: 'msg_011',
      conversationId: 'conv_001',
      senderId: 'client_001',
      content: '¡Increíble Carlos! Funciona perfectamente. Eres súper rápido y profesional 👏',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T11:18:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['prof_001'],
      readAt: '2024-03-15T11:19:00Z'
    },
    {
      id: 'msg_012',
      conversationId: 'conv_001',
      senderId: 'prof_001',
      content: 'Me alegra poder ayudarte! Te recomiendo lubricar la cerradura cada 6 meses para evitar que vuelva a pasar.',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T11:20:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['client_001'],
      readAt: '2024-03-15T11:21:00Z'
    },
    {
      id: 'msg_013',
      conversationId: 'conv_001',
      senderId: 'client_001',
      content: 'Perfecto, lo tendré en cuenta. ¿Te puedo pagar por transferencia o prefieres efectivo?',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T11:22:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['prof_001'],
      readAt: '2024-03-15T11:23:00Z'
    },
    {
      id: 'msg_014',
      conversationId: 'conv_001',
      senderId: 'prof_001',
      content: 'Como prefieras! Mi CBU es 1234567890123456789012. O también acepto efectivo.',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T11:25:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['client_001'],
      readAt: '2024-03-15T16:25:00Z'
    },
    {
      id: 'msg_015',
      conversationId: 'conv_001',
      senderId: 'client_001',
      content: '¡Muchas gracias Carlos! Excelente trabajo como siempre',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-15T16:30:00Z',
      status: MESSAGE_STATUS.DELIVERED,
      readBy: [],
      readAt: null
    }
  ],
  'conv_002': [
    {
      id: 'msg_020',
      conversationId: 'conv_002',
      senderId: 'client_002',
      content: 'Hola Miguel! Necesito pintar mi departamento de 2 ambientes. ¿Podrías darme un presupuesto?',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-12T08:00:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['prof_002'],
      readAt: '2024-03-12T08:30:00Z'
    },
    {
      id: 'msg_021',
      conversationId: 'conv_002',
      senderId: 'prof_002',
      content: '¡Hola Roberto! Claro que sí. ¿Qué ambientes son? ¿Living, cocina, dormitorio? ¿Aproximadamente cuántos m²?',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-12T08:35:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['client_002'],
      readAt: '2024-03-12T09:00:00Z'
    },
    {
      id: 'msg_022',
      conversationId: 'conv_002',
      senderId: 'client_002',
      content: 'Es living-comedor y un dormitorio. Calculo que serán unos 60m² en total. Las paredes están en buen estado.',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-12T09:15:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['prof_002'],
      readAt: '2024-03-12T10:00:00Z'
    },
    {
      id: 'msg_023',
      conversationId: 'conv_002',
      senderId: 'prof_002',
      content: 'Perfecto! Para 60m² con paredes en buen estado, el presupuesto sería de $45,000 incluyendo materiales y mano de obra. ¿Qué colores tenías en mente?',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-12T10:30:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['client_002'],
      readAt: '2024-03-12T11:00:00Z'
    },
    {
      id: 'msg_024',
      conversationId: 'conv_002',
      senderId: 'client_002',
      content: 'Me gusta el presupuesto! Quería el living en blanco roto y el dormitorio en un gris suave. ¿Cuándo podrías empezar?',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-12T11:30:00Z',
      status: MESSAGE_STATUS.READ,
      readBy: ['prof_002'],
      readAt: '2024-03-12T12:00:00Z'
    },
    {
      id: 'msg_025',
      conversationId: 'conv_002',
      senderId: 'prof_002',
      content: 'Perfecto Roberto! Nos vemos mañana a las 8:00 AM. Llevaré todos los materiales.',
      type: MESSAGE_TYPES.TEXT,
      timestamp: '2024-03-12T19:45:00Z',
      status: MESSAGE_STATUS.SENT,
      readBy: [],
      readAt: null
    }
  ]
};

// User presence data
export const userPresence = {
  'client_001': {
    isOnline: false,
    lastSeen: '2024-03-15T16:35:00Z',
    isTyping: false
  },
  'prof_001': {
    isOnline: true,
    lastSeen: '2024-03-15T17:00:00Z',
    isTyping: false
  },
  'client_002': {
    isOnline: true,
    lastSeen: '2024-03-12T20:00:00Z',
    isTyping: false
  },
  'prof_002': {
    isOnline: false,
    lastSeen: '2024-03-12T19:50:00Z',
    isTyping: false
  }
};

// Helper functions
export const getConversationsForUser = (userId) => {
  return Object.values(conversations).filter(conv => 
    conv.participants.includes(userId)
  ).sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
};

export const getMessagesForConversation = (conversationId) => {
  return messages[conversationId] || [];
};

export const createMessage = (conversationId, senderId, content, type = MESSAGE_TYPES.TEXT, metadata = null) => {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  const message = {
    id: messageId,
    conversationId,
    senderId,
    content,
    type,
    timestamp,
    status: MESSAGE_STATUS.SENDING,
    readBy: [],
    readAt: null
  };
  
  if (metadata) {
    message.metadata = metadata;
  }
  
  // Add to messages array
  if (!messages[conversationId]) {
    messages[conversationId] = [];
  }
  messages[conversationId].push(message);
  
  // Update conversation's last message
  if (conversations[conversationId]) {
    conversations[conversationId].lastMessage = {
      id: messageId,
      senderId,
      content: type === MESSAGE_TYPES.IMAGE ? '📷 Imagen' : 
               type === MESSAGE_TYPES.DOCUMENT ? '📄 Documento' :
               type === MESSAGE_TYPES.LOCATION ? '📍 Ubicación' : content,
      type,
      timestamp
    };
    conversations[conversationId].lastActivity = timestamp;
    
    // Update unread count
    conversations[conversationId].participants.forEach(participantId => {
      if (participantId !== senderId) {
        conversations[conversationId].unreadCount[participantId]++;
      }
    });
  }
  
  return message;
};

export const markMessageAsRead = (conversationId, messageId, userId) => {
  const conversation = conversations[conversationId];
  const conversationMessages = messages[conversationId];
  
  if (conversation && conversationMessages) {
    // Mark specific message as read
    const message = conversationMessages.find(msg => msg.id === messageId);
    if (message && !message.readBy.includes(userId)) {
      message.readBy.push(userId);
      message.readAt = new Date().toISOString();
      message.status = MESSAGE_STATUS.READ;
    }
    
    // Reset unread count for user
    conversation.unreadCount[userId] = 0;
  }
};

export const createConversation = (clientId, professionalId, orderId, serviceType) => {
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  const conversation = {
    id: conversationId,
    participants: [clientId, `prof_${professionalId}`],
    professionalId,
    clientId,
    orderId,
    serviceType,
    status: CONVERSATION_STATUS.ACTIVE,
    createdAt: timestamp,
    lastActivity: timestamp,
    unreadCount: {
      [clientId]: 0,
      [`prof_${professionalId}`]: 0
    },
    lastMessage: null
  };
  
  conversations[conversationId] = conversation;
  messages[conversationId] = [];
  
  return conversation;
};

export const updateUserPresence = (userId, isOnline, isTyping = false) => {
  if (!userPresence[userId]) {
    userPresence[userId] = {};
  }
  
  userPresence[userId].isOnline = isOnline;
  userPresence[userId].lastSeen = new Date().toISOString();
  userPresence[userId].isTyping = isTyping;
};

export const getUserPresence = (userId) => {
  return userPresence[userId] || {
    isOnline: false,
    lastSeen: null,
    isTyping: false
  };
};

export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return 'Nunca visto';
  
  const now = new Date();
  const lastSeenDate = new Date(lastSeen);
  const diffMs = now - lastSeenDate;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  
  return lastSeenDate.toLocaleDateString('es-AR', { 
    day: 'numeric', 
    month: 'short' 
  });
};

export const createNewConversation = (clientId, professionalId, initialMessage = '') => {
  // Check if conversation already exists between these users
  const existingConversation = Object.values(conversations).find(conv => 
    (conv.participants.includes(clientId.toString()) && conv.participants.includes(professionalId.toString()))
  );

  if (existingConversation) {
    return existingConversation.id;
  }

  // Create new conversation
  const conversationId = `conv_${Date.now()}`;
  const messageId = `msg_${Date.now()}`;
  
  conversations[conversationId] = {
    id: conversationId,
    participants: [clientId.toString(), professionalId.toString()],
    orderId: `order_${Date.now()}`,
    serviceType: 'Consulta general',
    status: CONVERSATION_STATUS.ACTIVE,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    unreadCount: {
      [clientId.toString()]: 0,
      [professionalId.toString()]: 1
    },
    lastMessage: {
      id: messageId,
      senderId: clientId.toString(),
      content: initialMessage || 'Hola, me gustaría consultar sobre tus servicios',
      type: MESSAGE_TYPES.TEXT,
      timestamp: new Date().toISOString()
    }
  };

  // Create initial message
  if (!messages[conversationId]) {
    messages[conversationId] = [];
  }

  messages[conversationId].push({
    id: messageId,
    conversationId,
    senderId: clientId.toString(),
    content: initialMessage || 'Hola, me gustaría consultar sobre tus servicios',
    type: MESSAGE_TYPES.TEXT,
    status: MESSAGE_STATUS.SENT,
    timestamp: new Date().toISOString(),
    readBy: [clientId.toString()]
  });

  return conversationId;
};

export default {
  conversations,
  messages,
  userPresence,
  MESSAGE_TYPES,
  MESSAGE_STATUS,
  CONVERSATION_STATUS,
  getConversationsForUser,
  getMessagesForConversation,
  createMessage,
  markMessageAsRead,
  createConversation,
  createNewConversation,
  updateUserPresence,
  getUserPresence,
  formatLastSeen
};