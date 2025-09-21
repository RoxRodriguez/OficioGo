import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/MockAuthContext';
import AuthNavbar from './components/AuthNavbar';
import LoginPage from './components/LoginPage';
import ProfessionalsMapPage from './components/ProfessionalsMapPage';
import GeolocationTest from './components/GeolocationTest';
import ChatPage from './components/ChatPage';
import CreateRequestPage from './components/CreateRequestPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import ReviewSystemPage from './components/ReviewSystemPage';
import ProfilePage from './components/ProfilePage';
import './geometric-animations.css';

// Importar imágenes de herramientas
import AgujereadoraImg from './img/Agujereadora.png';
import DestornilladorImg from './img/Destornillador.png';
import MartillaImg from './img/Martilla.png';
import MetroImg from './img/Metro.png';
import RodilloImg from './img/Rodillo.png';
import AlicateImg from './img/Alicate.png';
import CinturonImg from './img/Cinturon.png';

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Página de inicio completa
const HomePage = () => (
  <div>
    {/* Modern Geometric Hero Banner */}
    <section className="geometric-banner">
      {/* Animated Geometric Shapes */}
      <div className="shapes-container">
        {/* Central blob shape like in reference */}
        <div className="central-blob"></div>
        
        {/* Multiple diagonal lines */}
        <div className="diagonal-line-1"></div>
        <div className="diagonal-line-2"></div>
        <div className="diagonal-line-3"></div>
        <div className="diagonal-line-4"></div>
        <div className="diagonal-line-5"></div>
        <div className="diagonal-line-6"></div>
        
        {/* Enhanced dot patterns */}
        <div className="dot-pattern-1"></div>
        <div className="dot-pattern-2"></div>
        <div className="dot-pattern-3"></div>
        <div className="dot-pattern-4"></div>
        <div className="dot-pattern-5"></div>
        
        {/* Enhanced angular shapes */}
        <div className="angular-shape-1"></div>
        <div className="angular-shape-2"></div>
        <div className="angular-shape-3"></div>
        <div className="angular-shape-4"></div>
        
        {/* Enhanced sweeping lines */}
        <div className="sweep-line-1"></div>
        <div className="sweep-line-2"></div>
        <div className="sweep-line-3"></div>
        <div className="sweep-line-4"></div>
        
        {/* Floating particles */}
        <div className="particle-1"></div>
        <div className="particle-2"></div>
        <div className="particle-3"></div>
        <div className="particle-4"></div>
        <div className="particle-5"></div>
        
        {/* Complex geometric shapes */}
        <div className="complex-shape-1"></div>
        <div className="complex-shape-2"></div>
        
        {/* Tool Images with mix-blend-mode and rotation */}
        <img src={AgujereadoraImg} alt="Agujereadora" className="tool-image tool-agujereadora" />
        <img src={DestornilladorImg} alt="Destornillador" className="tool-image tool-destornillador" />
        <img src={MartillaImg} alt="Martillo" className="tool-image tool-martillo" />
        <img src={MetroImg} alt="Metro" className="tool-image tool-metro" />
        <img src={RodilloImg} alt="Rodillo" className="tool-image tool-rodillo" />
        <img src={AlicateImg} alt="Alicate" className="tool-image tool-alicate" />
        <img src={CinturonImg} alt="Cinturón" className="tool-image tool-cinturon" />
      </div>

      {/* Content */}
      <div className="banner-content">

        <h1 className="banner-title">
          OFICIO GO
        </h1>
        <p className="banner-subtitle">
          Encuentra tu profesional ideal para el servicio que necesitas
        </p>
        <div className="banner-buttons">
          <Link to="/professionals" className="banner-btn-primary">
            Buscar Profesionales
          </Link>
          <Link to="/login" className="banner-btn-secondary">
            Registrarse como Profesional
          </Link>
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
          <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>Acerca de</Link>
          <Link to="/contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contacto</Link>
          <Link to="/terms" style={{ color: '#9ca3af', textDecoration: 'none' }}>Términos</Link>
          <Link to="/privacy" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacidad</Link>
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
    <Link to="/" style={{ 
      background: '#2563eb', 
      color: 'white', 
      padding: '1rem 2rem', 
      borderRadius: '0.5rem', 
      textDecoration: 'none',
      display: 'inline-block'
    }}>
      ← Volver al inicio
    </Link>
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
                <ProfessionalsMapPage />
              </div>
            } />
            <Route path="/chat" element={
              <div>
                <AuthNavbar />
                <ChatPage />
              </div>
            } />
            <Route path="/create-request" element={
              <div>
                <AuthNavbar />
                <CreateRequestPage />
              </div>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <div>
                  <AuthNavbar />
                  <OrderHistoryPage />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/reviews" element={
              <div>
                <AuthNavbar />
                <ReviewSystemPage />
              </div>
            } />
            <Route path="/profile" element={
              <div>
                <AuthNavbar />
                <ProfilePage />
              </div>
            } />
            <Route path="/about" element={
              <div>
                <AuthNavbar />
                <SimplePage title="Acerca de OficioGo" description="Conectamos profesionales con clientes desde 2025" />
              </div>
            } />
            <Route path="/contact" element={
              <div>
                <AuthNavbar />
                <SimplePage title="Contacto" description="Ponte en contacto con nuestro equipo" />
              </div>
            } />
            <Route path="/terms" element={
              <div>
                <AuthNavbar />
                <SimplePage title="Términos y Condiciones" description="Lee nuestros términos de servicio" />
              </div>
            } />
            <Route path="/privacy" element={
              <div>
                <AuthNavbar />
                <SimplePage title="Política de Privacidad" description="Tu privacidad es importante para nosotros" />
              </div>
            } />
            <Route path="/test-geolocation" element={
              <div>
                <AuthNavbar />
                <GeolocationTest />
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