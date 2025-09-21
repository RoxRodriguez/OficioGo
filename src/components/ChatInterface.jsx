import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getMessagesForConversation, 
  createMessage, 
  markMessageAsRead,
  getUserPresence,
  updateUserPresence,
  MESSAGE_TYPES,
  MESSAGE_STATUS,
  formatLastSeen 
} from '../data/chat';
import { FaPaperPlane, FaImage, FaMapMarkerAlt, FaFileAlt, FaSmile } from 'react-icons/fa';

const ChatInterface = ({ conversationId, otherUser, onBack }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [presence, setPresence] = useState({});
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadMessages();
    loadPresence();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      loadMessages();
      loadPresence();
    }, 3000);

    return () => {
      clearInterval(interval);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const conversationMessages = getMessagesForConversation(conversationId);
    setMessages(conversationMessages);
    
    // Mark messages as read
    conversationMessages.forEach(msg => {
      if (msg.senderId !== currentUser.id && !msg.readBy.includes(currentUser.id)) {
        markMessageAsRead(conversationId, msg.id, currentUser.id);
      }
    });
  };

  const loadPresence = () => {
    const userPresence = getUserPresence(otherUser.id);
    setPresence(userPresence);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message = createMessage(
      conversationId,
      currentUser.id,
      newMessage.trim(),
      MESSAGE_TYPES.TEXT
    );
    
    setNewMessage('');
    setIsTyping(false);
    updateUserPresence(currentUser.id, true, false);
    
    // Simulate message delivery
    setTimeout(() => {
      message.status = MESSAGE_STATUS.SENT;
      loadMessages();
    }, 500);
    
    setTimeout(() => {
      message.status = MESSAGE_STATUS.DELIVERED;
      loadMessages();
    }, 1000);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      updateUserPresence(currentUser.id, true, true);
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateUserPresence(user.uid, true, false);
    }, 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const isImage = file.type.startsWith('image/');
    const messageType = isImage ? MESSAGE_TYPES.IMAGE : MESSAGE_TYPES.DOCUMENT;
    
    // Simulate file upload
    const fileUrl = isImage 
      ? 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      : 'https://example.com/document.pdf';
    
    const metadata = {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    };
    
    if (isImage) {
      metadata.url = fileUrl;
      metadata.caption = '';
    } else {
      metadata.downloadUrl = fileUrl;
    }
    
    createMessage(
      conversationId,
      user.uid,
      isImage ? fileUrl : file.name,
      messageType,
      metadata
    );
    
    loadMessages();
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          
          createMessage(
            conversationId,
            user.uid,
            locationUrl,
            MESSAGE_TYPES.LOCATION,
            {
              latitude,
              longitude,
              address: 'Mi ubicación actual'
            }
          );
          
          loadMessages();
        },
        (error) => {
          alert('No se pudo obtener tu ubicación');
        }
      );
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageStatus = (message) => {
    if (message.senderId !== user.uid) return null;
    
    switch (message.status) {
      case MESSAGE_STATUS.SENDING:
        return <span className="text-gray-400 text-xs">⏳</span>;
      case MESSAGE_STATUS.SENT:
        return <span className="text-gray-400 text-xs">✓</span>;
      case MESSAGE_STATUS.DELIVERED:
        return <span className="text-blue-400 text-xs">✓✓</span>;
      case MESSAGE_STATUS.READ:
        return <span className="text-blue-600 text-xs">✓✓</span>;
      case MESSAGE_STATUS.FAILED:
        return <span className="text-red-400 text-xs">❌</span>;
      default:
        return null;
    }
  };

  const renderMessage = (message) => {
    const isOwn = message.senderId === user.uid;
    const messageDate = new Date(message.timestamp);
    const today = new Date();
    const isToday = messageDate.toDateString() === today.toDateString();
    
    return (
      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
          {/* Message bubble */}
          <div className={`rounded-lg p-3 ${
            isOwn 
              ? 'bg-primary-600 text-white rounded-br-sm' 
              : 'bg-gray-200 text-gray-800 rounded-bl-sm'
          }`}>
            {/* Render different message types */}
            {message.type === MESSAGE_TYPES.TEXT && (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}
            
            {message.type === MESSAGE_TYPES.IMAGE && (
              <div>
                <img 
                  src={message.metadata?.url || message.content}
                  alt="Imagen compartida"
                  className="rounded-lg max-w-full h-auto mb-2 cursor-pointer"
                  onClick={() => window.open(message.metadata?.url || message.content, '_blank')}
                />
                {message.metadata?.caption && (
                  <p className="text-sm">{message.metadata.caption}</p>
                )}
              </div>
            )}
            
            {message.type === MESSAGE_TYPES.LOCATION && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span className="text-sm font-medium">Ubicación compartida</span>
                </div>
                <a 
                  href={message.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm underline ${isOwn ? 'text-blue-200' : 'text-blue-600'}`}
                >
                  Ver en Google Maps
                </a>
                {message.metadata?.address && (
                  <p className="text-xs mt-1 opacity-75">{message.metadata.address}</p>
                )}
              </div>
            )}
            
            {message.type === MESSAGE_TYPES.DOCUMENT && (
              <div className="flex items-center space-x-3">
                <FaFileAlt className="text-2xl opacity-75" />
                <div>
                  <p className="text-sm font-medium">{message.metadata?.fileName || 'Documento'}</p>
                  <p className="text-xs opacity-75">
                    {message.metadata?.fileSize ? `${(message.metadata.fileSize / 1024).toFixed(1)} KB` : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Message info */}
          <div className={`flex items-center space-x-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">
              {isToday ? formatTime(message.timestamp) : messageDate.toLocaleDateString('es-AR')}
            </span>
            {renderMessageStatus(message)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="bg-primary-600 text-white p-4 flex items-center space-x-3">
        <button 
          onClick={onBack}
          className="md:hidden text-white hover:text-gray-200"
        >
          ←
        </button>
        
        <div className="flex items-center space-x-3 flex-1">
          <img
            src={otherUser.avatar}
            alt={otherUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{otherUser.name}</h3>
            <p className="text-sm text-primary-200">
              {presence.isOnline ? (
                presence.isTyping ? 'Escribiendo...' : 'En línea'
              ) : (
                `Último visto ${formatLastSeen(presence.lastSeen)}`
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${presence.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-4">💬</div>
            <p>Aún no hay mensajes</p>
            <p className="text-sm">¡Comienza la conversación!</p>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        
        {/* Typing indicator */}
        {otherUserTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 rounded-lg rounded-bl-sm p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          {/* Attachment buttons */}
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500 hover:text-primary-600 p-2"
              title="Adjuntar archivo"
            >
              <FaImage />
            </button>
            
            <button
              type="button"
              onClick={shareLocation}
              className="text-gray-500 hover:text-primary-600 p-2"
              title="Compartir ubicación"
            >
              <FaMapMarkerAlt />
            </button>
          </div>
          
          {/* Message input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Escribe un mensaje..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600"
              title="Emojis"
            >
              <FaSmile />
            </button>
          </div>
          
          {/* Send button */}
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-colors ${
              newMessage.trim()
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;