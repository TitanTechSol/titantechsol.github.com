import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import './css/services-interactive.css';
import { servicesData } from './data/servicesData';
import { ComponentSkeleton } from './components/LoadingStates';
import CodeSplitErrorBoundary from './components/CodeSplitErrorBoundary';

// CAUSAI Enhanced: Lazy load components for optimal performance
const ServiceCard = React.lazy(() => import('./components/ServiceCard'));

const ServicesInteractive = () => {
  return (
    <div className="services-interactive">
      <div className="services-header">
        <h2>Our Services</h2>
        <p className="services-intro">
          Click on a service card to discover how we can help transform your business
        </p>
      </div>
      
      {/* Service Cards Grid - Matching Home Page Style */}
      <div className="services-grid-container">
        <CodeSplitErrorBoundary fallback={() => 
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>⚠️ Unable to load services. Please refresh the page.</p>
          </div>
        }>
          <Suspense fallback={<ComponentSkeleton height="400px" />}>
            <div className="services-grid">
              {servicesData.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          </Suspense>
        </CodeSplitErrorBoundary>
      </div>
      
      {/* Learn More CTA Below Cards */}
      <div className="services-cta">
        <Link to="/contact" className="cta-button">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default ServicesInteractive;
