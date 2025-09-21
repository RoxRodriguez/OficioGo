import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdersByClient, getStatusDisplay } from '../data/orders';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    // Simulate API call - in real app, get from auth context
    const clientId = 'user123';
    const clientOrders = getOrdersByClient(clientId);
    setOrders(clientOrders);
    setLoading(false);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'active') {
      return !['completed', 'paid', 'rated', 'cancelled'].includes(order.status);
    } else if (filter === 'completed') {
      return ['completed', 'paid', 'rated'].includes(order.status);
    }
    return true;
  });

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star text-yellow-400">★</span>);
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star text-gray-300">☆</span>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Mis solicitudes
        </h1>
        
        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas ({orders.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Activas ({orders.filter(o => !['completed', 'paid', 'rated', 'cancelled'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completadas ({orders.filter(o => ['completed', 'paid', 'rated'].includes(o.status)).length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filter === 'all' ? 'No tienes solicitudes' : `No tienes solicitudes ${filter === 'active' ? 'activas' : 'completadas'}`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? 'Cuando solicites un servicio, aparecerá aquí.' 
              : 'Cambia el filtro para ver otras solicitudes.'
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Buscar profesionales
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusDisplay(order.status);
            
            return (
              <div
                key={order.id}
                onClick={() => navigate(`/order/${order.id}`)}
                className="card p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Professional Info */}
                  <div className="flex-shrink-0">
                    <img
                      src={order.professional.profileImage}
                      alt={order.professional.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto md:mx-0"
                    />
                  </div>

                  {/* Order Info */}
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Orden #{order.id}
                          </h3>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                            {statusInfo.icon} {statusInfo.label}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">{order.professional.name}</span> - {order.professional.profession}
                        </p>

                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {order.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>📍 {order.location.address}</span>
                          <span>📅 {formatTimestamp(order.createdAt)}</span>
                          {order.serviceType === 'scheduled' && order.scheduledDate && (
                            <span>⏰ Programado</span>
                          )}
                        </div>

                        {order.rating && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-600">Tu calificación:</span>
                            <div className="flex text-sm">
                              {renderStars(order.rating.score)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price and Actions */}
                      <div className="text-center md:text-right flex-shrink-0">
                        {order.quotation && (
                          <div className="mb-3">
                            <p className="text-xl font-bold text-primary-600">
                              ${order.quotation.amount.toLocaleString()}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {order.payment ? 'Pagado' : 'Cotización'}
                            </p>
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/order/${order.id}`);
                          }}
                          className="btn-primary text-sm"
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Action */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Solicitar nuevo servicio
        </button>
      </div>
    </div>
  );
};

export default OrderHistory;