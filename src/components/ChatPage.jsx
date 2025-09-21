import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';
import mockApiService from '../services/mockApiService';

const ChatPage = () => {
  const { user, isClient, isProfessional } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Cargar conversaciones desde el servicio
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const conversationsData = await mockApiService.getConversations(user.id);
        setConversations(conversationsData);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  // Cargar mensajes cuando se selecciona una conversación
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;
      
      try {
        const messagesData = await mockApiService.getMessages(selectedConversation.id);
        const formattedMessages = messagesData.map(msg => ({
          ...msg,
          senderId: msg.senderId === user.id ? 'me' : 'other',
          timestamp: new Date(msg.timestamp).toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedConversation, user]);

  // Manejar profesional seleccionado desde el mapa
  useEffect(() => {
    const handleSelectedProfessional = async () => {
      const selectedProfessional = location.state?.selectedProfessional;
      if (!selectedProfessional || !user) return;

      try {
        // Buscar conversación existente
        const existingConversation = conversations.find(conv => 
          conv.participantName === selectedProfessional.name
        );
        
        if (existingConversation) {
          setSelectedConversation(existingConversation);
        } else {
          // Crear nueva conversación mock
          const newConversation = {
            id: Date.now(),
            participantName: selectedProfessional.name,
            participantRole: selectedProfessional.service,
            participantAvatar: selectedProfessional.avatar,
            lastMessage: 'Nueva conversación',
            lastMessageTime: 'Ahora',
            unreadCount: 0,
            isOnline: true
          };
          
          setConversations(prev => [newConversation, ...prev]);
          setSelectedConversation(newConversation);
          
          // Mensaje de bienvenida mock
          const welcomeMessage = {
            id: 1,
            senderId: 'other',
            senderName: selectedProfessional.name,
            content: `¡Hola! Soy ${selectedProfessional.name}, especialista en ${selectedProfessional.service}. ¿En qué puedo ayudarte?`,
            timestamp: new Date().toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            type: 'text'
          };
          
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Error handling selected professional:', error);
      }
    };

    if (conversations.length > 0) {
      handleSelectedProfessional();
    }
  }, [location.state, user, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const newMsg = {
        id: Date.now(),
        senderId: 'me',
        senderName: 'Tú',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        type: 'text'
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');

      // Actualizar última conversación
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMsg.content, lastMessageTime: 'Ahora' }
          : conv
      ));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div style={{
        background: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
          <h2 style={{ color: '#1f2937', marginBottom: '1rem' }}>Inicia sesión para chatear</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Necesitas iniciar sesión para acceder al sistema de mensajería
          </p>
          <button 
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Iniciar Sesión
          </button>
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
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬 Chat</h1>
        <p>Comunícate directamente con {isClient() ? 'profesionales' : 'clientes'}</p>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '2rem',
        height: 'calc(100vh - 200px)'
      }}>
        {/* Conversations List */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            <h3 style={{ margin: 0, color: '#1f2937' }}>Conversaciones</h3>
          </div>
          
          <div style={{ height: 'calc(100% - 80px)', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Cargando conversaciones...
              </div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                No hay conversaciones aún
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    background: selectedConversation?.id === conversation.id ? '#eff6ff' : 'white',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (selectedConversation?.id !== conversation.id) {
                      e.currentTarget.style.background = '#f9fafb';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedConversation?.id !== conversation.id) {
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
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
                        {conversation.participantAvatar}
                      </div>
                      {conversation.isOnline && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '0.75rem',
                          height: '0.75rem',
                          background: '#16a34a',
                          border: '2px solid white',
                          borderRadius: '50%'
                        }} />
                      )}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, color: '#1f2937', fontSize: '1rem' }}>
                          {conversation.participantName}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {conversation.lastMessageTime}
                        </span>
                      </div>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                        {conversation.participantRole}
                      </p>
                      <p style={{ 
                        margin: '0.25rem 0 0 0', 
                        color: '#374151', 
                        fontSize: '0.875rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {conversation.lastMessage}
                      </p>
                    </div>

                    {conversation.unreadCount > 0 && (
                      <div style={{
                        background: '#dc2626',
                        color: 'white',
                        borderRadius: '50%',
                        width: '1.5rem',
                        height: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
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
                  {selectedConversation.participantAvatar}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#1f2937' }}>
                    {selectedConversation.participantName}
                  </h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                    {selectedConversation.participantRole} • {selectedConversation.isOnline ? 'En línea' : 'Desconectado'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                padding: '1rem',
                overflowY: 'auto',
                background: 'linear-gradient(to bottom, #f8fafc, #ffffff)'
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.senderId === 'me' ? 'flex-end' : 'flex-start',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      background: message.senderId === 'me' 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : '#f3f4f6',
                      color: message.senderId === 'me' ? 'white' : '#1f2937',
                      padding: '1rem',
                      borderRadius: '1rem',
                      borderBottomRightRadius: message.senderId === 'me' ? '0.25rem' : '1rem',
                      borderBottomLeftRadius: message.senderId === 'me' ? '1rem' : '0.25rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <p style={{ margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
                        {message.content}
                      </p>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        opacity: 0.8 
                      }}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{
                padding: '1rem',
                borderTop: '1px solid #e5e7eb',
                background: 'white'
              }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    style={{
                      flex: 1,
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'none',
                      minHeight: '50px',
                      maxHeight: '120px'
                    }}
                    rows={1}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    style={{
                      background: newMessage.trim() 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : '#e5e7eb',
                      color: newMessage.trim() ? 'white' : '#9ca3af',
                      border: 'none',
                      borderRadius: '50%',
                      width: '3rem',
                      height: '3rem',
                      cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      fontSize: '1.25rem'
                    }}
                  >
                    📤
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                <h3>Selecciona una conversación</h3>
                <p>Elige una conversación para comenzar a chatear</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;