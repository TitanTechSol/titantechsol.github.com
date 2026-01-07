import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import PerformanceMonitor from './components/PerformanceMonitor';
import { PageSkeleton, TeamSkeleton, ServicesSkeleton } from './components/LoadingStates';
import CodeSplitErrorBoundary from './components/CodeSplitErrorBoundary';

// CAUSAI Enhanced: Lazy load components for optimal performance with proper loading states
const Home = React.lazy(() => import('./home'));
const Contact = React.lazy(() => import('./contact'));
const Team = React.lazy(() => import('./team'));
const ServicesInteractive = React.lazy(() => import('./services-interactive'));

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
        <CodeSplitErrorBoundary>
          <Routes>
            <Route path="/" element={
              <Suspense fallback={<PageSkeleton />}>
                <Home />
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<PageSkeleton />}>
                <Contact />
              </Suspense>
            } />
            <Route path="/team" element={
              <Suspense fallback={<TeamSkeleton />}>
                <Team />
              </Suspense>
            } />
            <Route path="/services" element={
              <Suspense fallback={<ServicesSkeleton />}>
                <ServicesInteractive />
              </Suspense>
            } />
          </Routes>
        </CodeSplitErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default App;