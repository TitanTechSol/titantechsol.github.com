import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import PerformanceMonitor from './components/PerformanceMonitor';

// Lazy load components for better performance
const Home = React.lazy(() => import('./home'));
const About = React.lazy(() => import('./about'));
const Contact = React.lazy(() => import('./contact'));
const Team = React.lazy(() => import('./team'));
const ServicesInteractive = React.lazy(() => import('./services-interactive'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    fontSize: '18px'
  }}>
    Loading...
  </div>
);

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Check for stored redirect path and navigate to it
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      // Use React Router's navigate instead of manual history manipulation
      navigate('/' + redirectPath, { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PerformanceMonitor />
      <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <main id="content" style={{ flex: '1' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/team" element={<Team />} />
            <Route path="/services" element={<ServicesInteractive />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default App;