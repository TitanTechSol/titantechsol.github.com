import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import './css/services-interactive.css';
import { servicesData } from './data/servicesData';
import { ComponentSkeleton } from './components/LoadingStates';
import CodeSplitErrorBoundary from './components/CodeSplitErrorBoundary';

// CAUSAI Enhanced: Lazy load components for optimal performance
const ServiceCard = React.lazy(() => import('./components/ServiceCard'));
const ServiceDetails = React.lazy(() => import('./components/ServiceDetails'));

const ServicesInteractive = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleServiceSelect = (service) => {
    setLoading(true);
    // Enhanced UX with loading state
    setTimeout(() => {
      setSelectedService(service);
      setLoading(false);
    }, 300);
  };

  const handleGetStarted = (service) => {
    // Analytics tracking for service interest
    if (window.gtag) {
      window.gtag('event', 'service_interest', {
        event_category: 'Services',
        event_label: service.name,
        value: 1
      });
    }
    
    // Smooth scroll to contact section or redirect to contact page
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on same page, redirect with service context
      window.location.href = `/contact?service=${service.id}`;
    }
  };

  return (
    <div className="services-interactive">
      <div className="services-header">
        <h2>Our Services</h2>
        <p className="services-intro">
          Select a service to learn more about our comprehensive technology solutions
        </p>
      </div>
      
      <div className="services-explorer">
        {/* Interactive Service Navigation Panel - RESTORED */}
        <div className="services-nav">
          <h3>Service Categories</h3>
          {loading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <span>Loading...</span>
            </div>
          )}
          
          <CodeSplitErrorBoundary fallback={() => 
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <p>⚠️ Unable to load services navigation.</p>
            </div>
          }>
            <Suspense fallback={<ComponentSkeleton height="300px" />}>
              <div className="services-nav-list">
                {servicesData.map((service) => (
                  <button
                    key={service.id}
                    className={`service-nav-item ${selectedService?.id === service.id ? 'active' : ''}`}
                    onClick={() => handleServiceSelect(service)}
                    disabled={loading}
                  >
                    <span className="service-icon" style={{ color: service.color }}>
                      {service.icon}
                    </span>
                    <div className="service-nav-text">
                      <span className="service-name">{service.name}</span>
                      <span className="service-short-desc">{service.shortDescription}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Suspense>
          </CodeSplitErrorBoundary>
        </div>
        
        {/* Interactive Service Details Panel - RESTORED */}
        <div className="services-details">
          {selectedService ? (
            <CodeSplitErrorBoundary fallback={() => 
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>⚠️ Unable to load service details.</p>
              </div>
            }>
              <Suspense fallback={<ComponentSkeleton height="400px" />}>
                <ServiceDetails 
                  service={selectedService} 
                  onGetStarted={handleGetStarted}
                />
              </Suspense>
            </CodeSplitErrorBoundary>
          ) : (
            <div className="service-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">👆</span>
                <h3>Select a Service</h3>
                <p>Choose a service from the left to explore our capabilities, processes, and technologies.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile-Responsive Service Cards Grid */}
      <div className="services-mobile">
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
                  isActive={selectedService?.id === service.id}
                  onClick={() => handleServiceSelect(service)}
                  onGetStarted={handleGetStarted}
                />
              ))}
            </div>
          </Suspense>
        </CodeSplitErrorBoundary>
      </div>
      
      <div className="services-cta">
        <h3>Ready to get started?</h3>
        <p>Let's discuss how we can help bring your project to life.</p>
        <Link to="/contact" className="cta-button">
          Get Free Consultation
        </Link>
      </div>
    </div>
  );
};

export default ServicesInteractive;
