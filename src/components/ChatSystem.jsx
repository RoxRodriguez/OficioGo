import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ConversationList from './ConversationList';
import ChatInterface from './ChatInterface';

const ChatSystem = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Check if there's a conversation ID in the URL
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId) {
      setSelectedConversation(conversationId);
      setShowMobileChat(true); // Show chat on mobile if coming from a direct link
    }
  }, [searchParams]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para acceder al sistema de mensajes
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="btn-primary"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedConversation(null);
  };

  return (
    <div className="h-screen bg-gray-50">
      <div className="h-full max-w-7xl mx-auto bg-white shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Conversations List - Hidden on mobile when chat is open */}
          <div className={`md:col-span-1 ${showMobileChat ? 'hidden md:block' : 'block'}`}>
            <ConversationList
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </div>

          {/* Chat Interface */}
          <div className={`md:col-span-2 ${!showMobileChat ? 'hidden md:block' : 'block'}`}>
            {selectedConversation ? (
              <ChatInterface
                conversationId={selectedConversation.id}
                otherUser={selectedConversation.otherUser}
                onBack={handleBackToList}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="text-6xl mb-6">💬</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Sistema de Mensajes
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Selecciona una conversación de la lista para comenzar a chatear con profesionales o clientes.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 Características:</h4>
                    <ul className="text-sm text-blue-700 text-left space-y-1">
                      <li>• Mensajes en tiempo real</li>
                      <li>• Compartir fotos y ubicación</li>
                      <li>• Estados de entrega y lectura</li>
                      <li>• Indicadores de presencia</li>
                      <li>• Historial completo de conversaciones</li>
                    </ul>
                  </div>

                  {user.role === 'cliente' && (
                    <div className="text-sm text-gray-500">
                      💡 Tip: Puedes iniciar conversaciones con profesionales desde sus perfiles
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;