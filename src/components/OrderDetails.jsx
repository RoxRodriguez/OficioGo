import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getOrderById, 
  updateOrderStatus, 
  acceptQuotation, 
  processPayment, 
  addRating,
  getStatusDisplay,
  ORDER_STATUSES 
} from '../data/orders';
import { useNotification } from './NotificationSystem';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState({ score: 5, comment: '' });

  useEffect(() => {
    const orderData = getOrderById(orderId);
    if (orderData) {
      setOrder(orderData);
    }
    setLoading(false);
  }, [orderId]);

  const handleAcceptQuotation = async () => {
    setActionLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedOrder = acceptQuotation(parseInt(orderId));
      setOrder(updatedOrder);
      
      addNotification({
        type: 'success',
        title: 'Cotización aceptada',
        message: `Has aceptado la cotización de ${order.professional.name}. El profesional ha sido notificado.`
      });
      
      // Simulate professional starting work
      setTimeout(() => {
        const inProgressOrder = updateOrderStatus(
          parseInt(orderId), 
          ORDER_STATUSES.IN_PROGRESS, 
          'El profesional confirmó y está en camino'
        );
        setOrder(inProgressOrder);
        
        addNotification({
          type: 'info',
          title: 'Profesional en camino',
          message: `${order.professional.name} confirmó tu solicitud y está en camino.`
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error accepting quotation:', error);
      alert('Error al aceptar la cotización');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteWork = async () => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const completedOrder = updateOrderStatus(
        parseInt(orderId), 
        ORDER_STATUSES.COMPLETED, 
        'Trabajo completado exitosamente'
      );
      setOrder(completedOrder);
      
      addNotification({
        type: 'success',
        title: 'Trabajo completado',
        message: 'El trabajo ha sido marcado como completado. Ya puedes proceder con el pago.'
      });
      
    } catch (error) {
      console.error('Error completing work:', error);
      alert('Error al completar el trabajo');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayment = async () => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        method: 'mock',
        amount: order.quotation.amount
      };
      
      const paidOrder = processPayment(parseInt(orderId), paymentData);
      setOrder(paidOrder);
      
      addNotification({
        type: 'payment',
        title: '¡Pago procesado!',
        message: `Pago de $${paymentData.amount.toLocaleString()} procesado exitosamente. ¡Gracias por usar OficioGo!`
      });
      
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error al procesar el pago');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ratedOrder = addRating(parseInt(orderId), rating);
      setOrder(ratedOrder);
      setShowRatingModal(false);
      
      addNotification({
        type: 'rating',
        title: '¡Gracias por tu calificación!',
        message: 'Tu opinión ayuda a otros usuarios a tomar mejores decisiones.'
      });
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error al enviar la calificación');
    } finally {
      setActionLoading(false);
    }
  };

  const renderStars = (currentRating, interactive = false) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => setRating(prev => ({ ...prev, score: i })) : undefined}
          className={`text-2xl ${
            i <= currentRating 
              ? 'text-yellow-400' 
              : 'text-gray-300'
          } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
          disabled={!interactive}
        >
          ★
        </button>
      );
    }
    
    return stars;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Orden no encontrada
        </h3>
        <p className="text-gray-500 mb-6">
          La orden que buscas no existe o ha sido eliminada.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const statusInfo = getStatusDisplay(order.status);

  return (
    <div className="order-details max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
        >
          ← Volver al inicio
        </button>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Orden #{order.id}
            </h1>
            <p className="text-gray-600">
              Creada el {formatTimestamp(order.createdAt)}
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
            <span className="text-lg">{statusInfo.icon}</span>
            <span className="font-medium">{statusInfo.label}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Profesional asignado
            </h3>
            
            <div className="flex items-center gap-4">
              <img
                src={order.professional.profileImage}
                alt={order.professional.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-grow">
                <h4 className="font-semibold text-gray-800">{order.professional.name}</h4>
                <p className="text-gray-600 capitalize">{order.professional.profession}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-yellow-400 text-sm">
                    {renderStars(order.professional.rating)}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {order.professional.rating} ({order.professional.totalReviews} reseñas)
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/professional/${order.professional.id}`)}
                className="btn-secondary"
              >
                Ver perfil
              </button>
            </div>
          </div>

          {/* Service Details */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Detalles del servicio
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Descripción</h4>
                <p className="text-gray-600">{order.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Ubicación</h4>
                <p className="text-gray-600">{order.location.address}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Tipo de servicio</h4>
                  <p className="text-gray-600 capitalize">
                    {order.serviceType === 'immediate' ? 'Inmediato' : 'Programado'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Urgencia</h4>
                  <p className="text-gray-600 capitalize">{order.urgencyLevel}</p>
                </div>
              </div>
              
              {order.scheduledDate && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Fecha programada</h4>
                  <p className="text-gray-600">{formatTimestamp(order.scheduledDate)}</p>
                </div>
              )}
              
              {order.photos && order.photos.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Fotos adjuntas</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {order.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quotation */}
          {order.quotation && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Cotización
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Monto:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${order.quotation.amount.toLocaleString()}
                  </span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Descripción:</span>
                  <p className="text-gray-600 mt-1">{order.quotation.description}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Duración estimada:</span>
                  <p className="text-gray-600">{order.quotation.estimatedDuration}</p>
                </div>
                
                <div className="text-sm text-gray-500">
                  Enviada el {formatTimestamp(order.quotation.sentAt)}
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          {order.payment && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Información de pago
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Monto pagado:</span>
                  <span className="font-bold text-green-600">
                    ${order.payment.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Método:</span>
                  <span className="text-gray-600">Pago simulado</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">ID Transacción:</span>
                  <span className="text-gray-600 font-mono text-sm">
                    {order.payment.transactionId}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500">
                  Pagado el {formatTimestamp(order.payment.paidAt)}
                </div>
              </div>
            </div>
          )}

          {/* Rating */}
          {order.rating && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tu calificación
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400 text-xl">
                    {renderStars(order.rating.score)}
                  </div>
                  <span className="font-medium text-gray-700">
                    {order.rating.score}/5 estrellas
                  </span>
                </div>
                
                {order.rating.comment && (
                  <div>
                    <p className="text-gray-600">{order.rating.comment}</p>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Calificado el {formatTimestamp(order.rating.ratedAt)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Acciones
            </h3>
            
            <div className="space-y-3">
              {order.status === ORDER_STATUSES.QUOTED && (
                <button
                  onClick={handleAcceptQuotation}
                  disabled={actionLoading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {actionLoading ? 'Procesando...' : 'Aceptar cotización'}
                </button>
              )}
              
              {order.status === ORDER_STATUSES.IN_PROGRESS && (
                <button
                  onClick={handleCompleteWork}
                  disabled={actionLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Procesando...' : 'Marcar como completado'}
                </button>
              )}
              
              {order.status === ORDER_STATUSES.COMPLETED && (
                <button
                  onClick={handlePayment}
                  disabled={actionLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Procesando pago...' : `Pagar $${order.quotation.amount.toLocaleString()}`}
                </button>
              )}
              
              {order.status === ORDER_STATUSES.PAID && (
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Calificar servicio
                </button>
              )}
              
              {[ORDER_STATUSES.PENDING, ORDER_STATUSES.QUOTED].includes(order.status) && (
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de que quieres cancelar esta orden?')) {
                      const cancelledOrder = updateOrderStatus(
                        parseInt(orderId), 
                        ORDER_STATUSES.CANCELLED, 
                        'Orden cancelada por el cliente'
                      );
                      setOrder(cancelledOrder);
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar orden
                </button>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Historial
            </h3>
            
            <div className="space-y-4">
              {order.timeline.map((event, index) => {
                const eventStatus = getStatusDisplay(event.status);
                return (
                  <div key={index} className="flex gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-${eventStatus.color}-100 text-${eventStatus.color}-600`}>
                      {eventStatus.icon}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{eventStatus.label}</p>
                      {event.note && (
                        <p className="text-sm text-gray-600">{event.note}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(event.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Calificar servicio
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación (1-5 estrellas)
                </label>
                <div className="flex justify-center gap-1">
                  {renderStars(rating.score, true)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario (opcional)
                </label>
                <textarea
                  value={rating.comment}
                  onChange={(e) => setRating(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Comparte tu experiencia con este profesional..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 btn-secondary"
                disabled={actionLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={actionLoading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {actionLoading ? 'Enviando...' : 'Enviar calificación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;