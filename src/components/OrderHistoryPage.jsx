import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';
import mockApiService from '../services/mockApiService';

const OrderHistoryPage = () => {
  const { user, isClient, isProfessional } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, in-progress, completed, cancelled
  const [loading, setLoading] = useState(true);

  const statusConfig = {
    pending: { label: 'Pendiente', color: '#ea580c', bgColor: '#fff7ed' },
    'in-progress': { label: 'En Progreso', color: '#2563eb', bgColor: '#eff6ff' },
    completed: { label: 'Completado', color: '#16a34a', bgColor: '#f0fdf4' },
    cancelled: { label: 'Cancelado', color: '#dc2626', bgColor: '#fef2f2' }
  };

  const urgencyConfig = {
    low: { label: 'Baja', color: '#16a34a' },
    normal: { label: 'Normal', color: '#ea580c' },
    high: { label: 'Alta', color: '#dc2626' },
    urgent: { label: 'Urgente', color: '#7c2d12' }
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        if (user) {
          // Usuario autenticado - cargar sus pedidos reales
          const userOrders = await mockApiService.getOrders(user.id, user.role || 'CLIENT');
          setOrders(userOrders);
        } else {
          // Usuario no autenticado - mostrar datos de demostración
          const demoOrders = await mockApiService.getOrders('user123', 'CLIENT'); // Cliente de demostración
          setOrders(demoOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        // En lugar de alert, establecer pedidos vacíos
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, navigate]);

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  const handleChatWithProfessional = (order) => {
    navigate('/chat', {
      state: {
        selectedProfessional: {
          id: order.id,
          name: order.professionalName,
          service: order.serviceType,
          avatar: order.professionalAvatar
        }
      }
    });
  };

  const handleViewDetails = (order) => {
    // Navegar a la página de detalles del pedido con datos reales
    navigate('/order-details', { state: { order } });
  };

  const handleRateService = (order) => {
    navigate('/reviews', {
      state: {
        order: order
      }
    });
  };

  if (loading) {
    return (
      <div style={{
        background: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Demo Banner */}
      {!user && (
        <div style={{
          background: 'linear-gradient(90deg, #F59E0B, #D97706)',
          color: 'white',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          🎭 <strong>Vista de Demostración</strong> - Estos son datos de ejemplo. 
          <Link to="/login" style={{ color: 'white', marginLeft: '0.5rem', textDecoration: 'underline' }}>
            Inicia sesión para ver tus pedidos reales
          </Link>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          📋 {user && isClient() ? 'Mis Solicitudes' : user && isProfessional() ? 'Mis Trabajos' : 'Historial de Pedidos'}
        </h1>
        <p>
          {user && isClient() 
            ? 'Historial de servicios solicitados' 
            : user && isProfessional()
            ? 'Trabajos asignados y completados'
            : 'Ejemplo de gestión de pedidos en OficioGo'
          }
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Filters */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Filtrar por estado:</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { value: 'all', label: 'Todos' },
              { value: 'pending', label: 'Pendientes' },
              { value: 'in-progress', label: 'En Progreso' },
              { value: 'completed', label: 'Completados' },
              { value: 'cancelled', label: 'Cancelados' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: filter === option.value ? 'none' : '1px solid #d1d5db',
                  background: filter === option.value 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  color: filter === option.value ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: filter === option.value ? '600' : '400'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
              No hay {filter === 'all' ? 'órdenes' : `órdenes ${statusConfig[filter]?.label.toLowerCase()}`}
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {isClient() 
                ? 'Aún no has solicitado ningún servicio'
                : 'No tienes trabajos asignados en este momento'
              }
            </p>
            {isClient() && (
              <button
                onClick={() => navigate('/professionals')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Buscar Profesionales
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {filteredOrders.map(order => (
              <div
                key={order.id}
                style={{
                  background: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'start'
                }}>
                  {/* Order Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{order.professionalAvatar}</span>
                      <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.25rem' }}>
                        {order.title}
                      </h3>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: statusConfig[order.status].color,
                          background: statusConfig[order.status].bgColor
                        }}
                      >
                        {statusConfig[order.status].label}
                      </span>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: urgencyConfig[order.urgency].color,
                          background: `${urgencyConfig[order.urgency].color}20`
                        }}
                      >
                        {urgencyConfig[order.urgency].label}
                      </span>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                        <strong>
                          {isClient() ? 'Profesional:' : 'Cliente:'} 
                        </strong>{' '}
                        {isClient() ? order.professionalName : order.clientName}
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                        <strong>Servicio:</strong> {order.serviceType}
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                        <strong>Dirección:</strong> {order.address}
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                        <strong>Presupuesto:</strong> ${order.budget.toLocaleString()}
                        {order.finalPrice && order.finalPrice !== order.budget && (
                          <span style={{ color: '#16a34a', fontWeight: '600' }}>
                            {' '}→ ${order.finalPrice.toLocaleString()} (Final)
                          </span>
                        )}
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                        <strong>Creado:</strong> {new Date(order.createdAt).toLocaleDateString('es-ES')}
                      </p>
                      {order.scheduledDate && (
                        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                          <strong>Programado:</strong> {new Date(order.scheduledDate).toLocaleDateString('es-ES')} a las {new Date(order.scheduledDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>

                    <p style={{ margin: '0 0 1rem 0', color: '#374151', lineHeight: 1.5 }}>
                      {order.description}
                    </p>

                    {order.rating && order.review && (
                      <div style={{
                        background: '#f9fafb',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginTop: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#fbbf24' }}>
                            {'⭐'.repeat(order.rating)}
                          </span>
                          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            ({order.rating}/5)
                          </span>
                        </div>
                        <p style={{ margin: 0, color: '#374151', fontStyle: 'italic' }}>
                          "{order.review}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                    <button
                      onClick={() => handleViewDetails(order)}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        background: 'white',
                        color: '#374151',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Ver Detalles
                    </button>

                    {(order.status === 'in-progress' || order.status === 'pending') && (
                      <button
                        onClick={() => handleChatWithProfessional(order)}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: '0.375rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        💬 Chat
                      </button>
                    )}

                    {order.status === 'completed' && !order.rating && isClient() && (
                      <button
                        onClick={() => handleRateService(order)}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: '0.375rem',
                          background: '#16a34a',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        ⭐ Calificar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;