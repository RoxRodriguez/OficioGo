import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getConversationsForUser, 
  getUserPresence,
  formatLastSeen,
  MESSAGE_TYPES 
} from '../data/chat';
import { getProfessionalById } from '../data/professionals';

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, online

  useEffect(() => {
    loadConversations();
    
    // Simulate real-time updates
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const loadConversations = () => {
    if (!user) return;
    
    const userConversations = getConversationsForUser(currentUser.id);
    
    // Enhance conversations with user data
    const enhancedConversations = userConversations.map(conv => {
      const otherUserId = conv.participants.find(p => p !== currentUser.id);
      const isClientConversation = user.role === 'cliente';
      
      let otherUser;
      if (isClientConversation) {
        // Client viewing professional
        const professional = getProfessionalById(conv.professionalId);
        otherUser = {
          id: `prof_${conv.professionalId}`,
          name: professional?.name || 'Profesional',
          avatar: professional?.profileImage || `https://ui-avatars.io/api/?name=Profesional&background=0D8ABC&color=fff`,
          profession: professional?.profession || 'Servicio'
        };
      } else {
        // Professional viewing client
        otherUser = {
          id: conv.clientId,
          name: `Cliente ${conv.clientId}`,
          avatar: `https://ui-avatars.io/api/?name=Cliente&background=0D8ABC&color=fff`,
          profession: 'Cliente'
        };
      }
      
      const presence = getUserPresence(otherUser.id);
      
      return {
        ...conv,
        otherUser,
        presence,
        unreadCount: conv.unreadCount[currentUser.id] || 0
      };
    });
    
    setConversations(enhancedConversations);
  };

  const filteredConversations = conversations.filter(conv => {
    // Search filter
    const matchesSearch = conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Status filter
    switch (filter) {
      case 'unread':
        return conv.unreadCount > 0;
      case 'online':
        return conv.presence.isOnline;
      default:
        return true;
    }
  });

  const formatLastMessage = (conversation) => {
    if (!conversation.lastMessage) return 'Nueva conversación';
    
    const { lastMessage } = conversation;
    const isOwnMessage = lastMessage.senderId === currentUser.id;
    const prefix = isOwnMessage ? 'Tú: ' : '';
    
    switch (lastMessage.type) {
      case MESSAGE_TYPES.IMAGE:
        return `${prefix}📷 Imagen`;
      case MESSAGE_TYPES.DOCUMENT:
        return `${prefix}📄 Documento`;
      case MESSAGE_TYPES.LOCATION:
        return `${prefix}📍 Ubicación`;
      default:
        return `${prefix}${lastMessage.content}`;
    }
  };

  const formatLastActivity = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('es-AR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mensajes</h2>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar conversaciones..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === 'unread' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            No leídos
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === 'online' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En línea
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <p className="font-medium">No hay conversaciones</p>
            <p className="text-sm">
              {searchTerm 
                ? 'No se encontraron conversaciones que coincidan con la búsqueda'
                : 'Inicia una conversación con un profesional'
              }
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedConversationId === conversation.id ? 'bg-primary-50 border-primary-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar with presence indicator */}
                <div className="relative">
                  <img
                    src={conversation.otherUser.avatar}
                    alt={conversation.otherUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    conversation.presence.isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                {/* Conversation info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {conversation.otherUser.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatLastActivity(conversation.lastActivity)}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <div className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    📋 {conversation.serviceType}
                  </p>
                  
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0 ? 'font-medium text-gray-800' : 'text-gray-500'
                  }`}>
                    {formatLastMessage(conversation)}
                  </p>
                  
                  {/* Typing indicator */}
                  {conversation.presence.isTyping && (
                    <p className="text-xs text-primary-600 mt-1 flex items-center">
                      <span className="flex space-x-1 mr-2">
                        <div className="w-1 h-1 bg-primary-600 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </span>
                      Escribiendo...
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{conversations.length} conversaciones</span>
          <span>
            {conversations.filter(c => c.unreadCount > 0).length} sin leer
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;