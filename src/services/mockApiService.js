import mockDatabase from '../data/mockDatabase.json';

// Simulamos una base de datos en memoria
let database = { ...mockDatabase };

// Simulamos delays de red para mayor realismo
const networkDelay = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

export const mockApiService = {
  // USUARIOS
  async getUser(id) {
    await networkDelay();
    return database.users.find(user => user.id === id);
  },

  async getUserByEmail(email) {
    await networkDelay();
    return database.users.find(user => user.email === email);
  },

  async updateUser(id, updates) {
    await networkDelay();
    const userIndex = database.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      database.users[userIndex] = { ...database.users[userIndex], ...updates };
      return database.users[userIndex];
    }
    throw new Error('Usuario no encontrado');
  },

  // PROFESIONALES
  async getProfessionals(filters = {}) {
    await networkDelay();
    let professionals = database.users.filter(user => user.role === 'PROFESSIONAL');
    
    if (filters.service && filters.service !== 'all') {
      professionals = professionals.filter(prof => prof.service === filters.service);
    }
    
    if (filters.availability !== undefined) {
      professionals = professionals.filter(prof => prof.availability === filters.availability);
    }
    
    return professionals;
  },

  async getProfessional(id) {
    await networkDelay();
    return database.users.find(user => user.id === id && user.role === 'PROFESSIONAL');
  },

  // ÓRDENES
  async getOrders(userId, role = 'CLIENT') {
    await networkDelay();
    if (role === 'CLIENT') {
      return database.orders.filter(order => order.clientId === userId);
    } else {
      return database.orders.filter(order => order.professionalId === userId);
    }
  },

  async getOrder(id) {
    await networkDelay();
    return database.orders.find(order => order.id === id);
  },

  async createOrder(orderData) {
    await networkDelay();
    const newOrder = {
      id: Date.now(),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending'
    };
    database.orders.push(newOrder);
    return newOrder;
  },

  async updateOrder(id, updates) {
    await networkDelay();
    const orderIndex = database.orders.findIndex(order => order.id === id);
    if (orderIndex !== -1) {
      database.orders[orderIndex] = { ...database.orders[orderIndex], ...updates };
      return database.orders[orderIndex];
    }
    throw new Error('Orden no encontrada');
  },

  // CONVERSACIONES Y MENSAJES
  async getConversations(userId) {
    await networkDelay();
    const userConversations = database.conversations.filter(conv => 
      conv.participants.includes(userId)
    );
    
    // Enriquecer con datos de usuario
    return userConversations.map(conv => {
      const otherUserId = conv.participants.find(id => id !== userId);
      const otherUser = database.users.find(user => user.id === otherUserId);
      const order = database.orders.find(order => order.id === conv.orderId);
      
      return {
        ...conv,
        participantName: otherUser?.name,
        participantRole: otherUser?.service || otherUser?.role,
        participantAvatar: otherUser?.avatar,
        isOnline: Math.random() > 0.3, // Simulamos estado online
        orderTitle: order?.title
      };
    });
  },

  async getMessages(conversationId) {
    await networkDelay();
    const messages = database.messages.filter(msg => msg.conversationId === conversationId);
    
    // Enriquecer con datos de usuario
    return messages.map(msg => {
      const sender = database.users.find(user => user.id === msg.senderId);
      return {
        ...msg,
        senderName: sender?.name,
        senderAvatar: sender?.avatar
      };
    });
  },

  async sendMessage(conversationId, senderId, content) {
    await networkDelay();
    const newMessage = {
      id: Date.now(),
      conversationId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    database.messages.push(newMessage);
    
    // Actualizar conversación
    const convIndex = database.conversations.findIndex(conv => conv.id === conversationId);
    if (convIndex !== -1) {
      database.conversations[convIndex].lastMessage = content;
      database.conversations[convIndex].lastMessageTime = new Date().toISOString();
    }
    
    const sender = database.users.find(user => user.id === senderId);
    return {
      ...newMessage,
      senderName: sender?.name,
      senderAvatar: sender?.avatar
    };
  },

  async createConversation(participants, orderId = null) {
    await networkDelay();
    const newConversation = {
      id: Date.now(),
      participants,
      lastMessage: 'Nueva conversación',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      orderId
    };
    
    database.conversations.push(newConversation);
    return newConversation;
  },

  // REVIEWS
  async getReviews(professionalId = null, clientId = null) {
    await networkDelay();
    let reviews = database.reviews;
    
    if (professionalId) {
      reviews = reviews.filter(review => review.professionalId === professionalId);
    }
    
    if (clientId) {
      reviews = reviews.filter(review => review.clientId === clientId);
    }
    
    // Enriquecer con datos
    return reviews.map(review => {
      const professional = database.users.find(user => user.id === review.professionalId);
      const client = database.users.find(user => user.id === review.clientId);
      const order = database.orders.find(order => order.id === review.orderId);
      
      return {
        ...review,
        professionalName: professional?.name,
        professionalService: professional?.service,
        professionalAvatar: professional?.avatar,
        clientName: client?.name,
        orderTitle: order?.title,
        verified: true
      };
    });
  },

  async createReview(reviewData) {
    await networkDelay();
    const newReview = {
      id: Date.now(),
      ...reviewData,
      createdAt: new Date().toISOString()
    };
    
    database.reviews.push(newReview);
    
    // Actualizar rating del profesional
    const professionalReviews = database.reviews.filter(r => r.professionalId === reviewData.professionalId);
    const avgRating = professionalReviews.reduce((sum, r) => sum + r.rating, 0) / professionalReviews.length;
    
    const profIndex = database.users.findIndex(user => user.id === reviewData.professionalId);
    if (profIndex !== -1) {
      database.users[profIndex].rating = Math.round(avgRating * 10) / 10;
    }
    
    return newReview;
  },

  // NOTIFICACIONES
  async getNotifications(userId) {
    await networkDelay();
    return database.notifications
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async markNotificationAsRead(notificationId) {
    await networkDelay();
    const notifIndex = database.notifications.findIndex(notif => notif.id === notificationId);
    if (notifIndex !== -1) {
      database.notifications[notifIndex].read = true;
      return database.notifications[notifIndex];
    }
    throw new Error('Notificación no encontrada');
  },

  async createNotification(notificationData) {
    await networkDelay();
    const newNotification = {
      id: Date.now(),
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    database.notifications.push(newNotification);
    return newNotification;
  },

  // PAGOS
  async getPayments(userId, role = 'CLIENT') {
    await networkDelay();
    let payments = database.payments;
    
    // Filtrar por órdenes del usuario
    const userOrders = await this.getOrders(userId, role);
    const orderIds = userOrders.map(order => order.id);
    
    return payments.filter(payment => orderIds.includes(payment.orderId));
  },

  async processPayment(paymentData) {
    await networkDelay();
    
    // Simular procesamiento
    if (Math.random() < 0.95) { // 95% éxito
      const newPayment = {
        id: Date.now(),
        ...paymentData,
        status: 'completed',
        transactionId: `TXN${Date.now()}`,
        createdAt: new Date().toISOString(),
        invoice: {
          number: `INV-${Date.now()}`,
          items: [{
            description: paymentData.description,
            quantity: 1,
            unitPrice: paymentData.amount,
            total: paymentData.amount
          }],
          subtotal: paymentData.amount,
          tax: 0,
          total: paymentData.amount
        }
      };
      
      database.payments.push(newPayment);
      
      // Actualizar estado de la orden
      await this.updateOrder(paymentData.orderId, { 
        paymentStatus: 'paid',
        paymentMethod: paymentData.method 
      });
      
      return newPayment;
    } else {
      throw new Error('Error al procesar el pago. Intenta nuevamente.');
    }
  },

  // ESTADÍSTICAS
  async getUserStats(userId, role) {
    await networkDelay();
    
    if (role === 'PROFESSIONAL') {
      const orders = database.orders.filter(order => order.professionalId === userId);
      const reviews = database.reviews.filter(review => review.professionalId === userId);
      
      return {
        totalJobs: orders.length,
        completedJobs: orders.filter(order => order.status === 'completed').length,
        totalEarnings: orders
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (order.finalPrice || order.budget), 0),
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0,
        totalReviews: reviews.length,
        responseTime: database.users.find(user => user.id === userId)?.responseTime || '30 min'
      };
    } else {
      const orders = database.orders.filter(order => order.clientId === userId);
      const reviews = database.reviews.filter(review => review.clientId === userId);
      
      return {
        totalOrders: orders.length,
        completedOrders: orders.filter(order => order.status === 'completed').length,
        totalSpent: orders
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (order.finalPrice || order.budget), 0),
        reviewsGiven: reviews.length,
        favoriteServices: ['Plomería', 'Electricidad'] // Mock data
      };
    }
  },

  // UTILIDADES
  async searchProfessionals(query, filters = {}) {
    await networkDelay();
    const professionals = await this.getProfessionals(filters);
    
    if (!query) return professionals;
    
    return professionals.filter(prof => 
      prof.name.toLowerCase().includes(query.toLowerCase()) ||
      prof.service.toLowerCase().includes(query.toLowerCase()) ||
      prof.specialties?.some(spec => spec.toLowerCase().includes(query.toLowerCase()))
    );
  },

  // Simulamos cálculo de distancia
  calculateDistance(userLocation, professionalLocation) {
    if (!userLocation || !professionalLocation) return null;
    
    // Fórmula de Haversine simplificada para CABA
    const R = 6371; // Radio de la Tierra en km
    const dLat = (professionalLocation.lat - userLocation.lat) * Math.PI / 180;
    const dLng = (professionalLocation.lng - userLocation.lng) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(professionalLocation.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Redondear a 1 decimal
  }
};

export default mockApiService;