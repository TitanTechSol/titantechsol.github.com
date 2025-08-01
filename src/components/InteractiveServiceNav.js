// CAUSAI Enhanced: Interactive Service Navigation - Code Split Optimized
import React, { Suspense } from 'react';
import { ComponentSkeleton } from './LoadingStates';
import CodeSplitErrorBoundary from './CodeSplitErrorBoundary';

// Lazy load the detailed service content component
const ServiceDetails = React.lazy(() => import('./ServiceDetails'));

const InteractiveServiceNav = ({ 
  services, 
  activeService, 
  onServiceClick, 
  onGetStarted 
}) => {
  return (
    <div className="services-container">
      {/* Navigation panel - always visible */}
      <div className="services-nav">
        {services.map((service) => (
          <div 
            key={service.id}
            className={`service-nav-item ${activeService === service.id ? 'active' : ''}`}
            onClick={() => onServiceClick(service.id)}
          >
            <span className="service-icon">{service.icon}</span>
            <span className="service-name">{service.name}</span>
          </div>
        ))}
      </div>
      
      {/* Details panel - lazy loaded */}
      <div className="service-details">
        {activeService ? (
          <CodeSplitErrorBoundary fallback={() => 
            <div className="service-error">
              <p>Unable to load service details. Please try again.</p>
            </div>
          }>
            <Suspense fallback={<ComponentSkeleton height="300px" />}>
              <ServiceDetails 
                service={services.find(s => s.id === activeService)}
                onGetStarted={onGetStarted}
              />
            </Suspense>
          </CodeSplitErrorBoundary>
        ) : (
          <div className="service-placeholder">
            <p>Select a service to learn more about our expertise and approach!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveServiceNav;
