import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/MockAuthContext';
import AuthNavbar from './components/AuthNavbar';
import LoginPage from './components/LoginPage';

// Página de inicio completa
const HomePage = () => (
  <div>
    {/* Hero Section */}
    <section style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '4rem 2rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Conectamos profesionales con clientes
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
          Encuentra los mejores profesionales cerca de ti o ofrece tus servicios a miles de clientes
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/professionals" style={{
            background: 'white',
            color: '#2563eb',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Buscar Profesionales
          </a>
          <a href="/login" style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            border: '2px solid white',
            display: 'inline-block'
          }}>
            Registrarse como Profesional
          </a>
        </div>
      </div>
    </section>

    {/* Servicios Section */}
    <section style={{ padding: '4rem 2rem', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', color: '#1f2937' }}>
          Servicios Populares
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          {[
            { icon: '🔧', title: 'Plomería', desc: 'Reparaciones e instalaciones' },
            { icon: '⚡', title: 'Electricidad', desc: 'Instalaciones eléctricas' },
            { icon: '🏠', title: 'Construcción', desc: 'Obras y remodelaciones' },
            { icon: '🎨', title: 'Pintura', desc: 'Pintura interior y exterior' },
            { icon: '❄️', title: 'Refrigeración', desc: 'Aire acondicionado' },
            { icon: '🚗', title: 'Mecánica', desc: 'Reparación de vehículos' }
          ].map((service, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{service.icon}</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>{service.title}</h3>
              <p style={{ color: '#6b7280' }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Como Funciona Section */}
    <section style={{ padding: '4rem 2rem', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', color: '#1f2937' }}>
          ¿Cómo funciona?
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '3rem' 
        }}>
          {[
            { 
              step: '1', 
              title: 'Busca', 
              desc: 'Encuentra profesionales cerca de tu ubicación usando nuestro mapa interactivo',
              icon: '🔍'
            },
            { 
              step: '2', 
              title: 'Contacta', 
              desc: 'Envía mensajes directos y solicita presupuestos a través de nuestro chat',
              icon: '💬'
            },
            { 
              step: '3', 
              title: 'Contrata', 
              desc: 'Revisa calificaciones, compara precios y contrata al mejor profesional',
              icon: '✅'
            }
          ].map((step, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ 
                background: '#2563eb', 
                color: 'white', 
                width: '4rem', 
                height: '4rem', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem', 
                margin: '0 auto 1rem',
                fontWeight: 'bold'
              }}>
                {step.step}
              </div>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{step.icon}</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>{step.title}</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer style={{ background: '#1f2937', color: 'white', padding: '2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔧</span>
          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>OficioGo</h3>
        </div>
        <p style={{ opacity: 0.8 }}>Conectando profesionales con clientes desde 2025</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <a href="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>Acerca de</a>
          <a href="/contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contacto</a>
          <a href="/terms" style={{ color: '#9ca3af', textDecoration: 'none' }}>Términos</a>
          <a href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacidad</a>
        </div>
      </div>
    </footer>
  </div>
);

// Componente simple para otras páginas
const SimplePage = ({ title, description }) => (
  <div style={{
    padding: '4rem 2rem',
    textAlign: 'center',
    background: '#f8fafc',
    minHeight: '80vh',
    fontFamily: 'Arial, sans-serif'
  }}>
    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1e40af' }}>{title}</h1>
    <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem' }}>{description}</p>
    <a href="/" style={{ 
      background: '#2563eb', 
      color: 'white', 
      padding: '1rem 2rem', 
      borderRadius: '0.5rem', 
      textDecoration: 'none',
      display: 'inline-block'
    }}>
      ← Volver al inicio
    </a>
  </div>
);

function App() {
  console.log('🚀 App component rendering...');
  
  return (
    <div style={{ margin: 0, padding: 0, minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <div>
                <AuthNavbar />
                <HomePage />
              </div>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/professionals" element={
              <div>
                <AuthNavbar />
                <SimplePage title="Buscar Profesionales" description="Encuentra los mejores profesionales cerca de ti" />
              </div>
            } />
            <Route path="/chat" element={
              <div>
                <AuthNavbar />
                <SimplePage title="Chat" description="Sistema de mensajería directa" />
              </div>
            } />
            <Route path="/create-request" element={
              <div>
                <AuthNavbar />
                <SimplePage title="Crear Solicitud" description="Solicita un servicio profesional" />
              </div>
            } />
            <Route path="/orders" element={
              <div>
                <AuthNavbar />
                <SimplePage title="Mis Pedidos" description="Historial de solicitudes y servicios" />
              </div>
            } />
            <Route path="/reviews" element={
              <div>
                <AuthNavbar />
                <SimplePage title="Calificaciones" description="Sistema de reviews y valoraciones" />
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;