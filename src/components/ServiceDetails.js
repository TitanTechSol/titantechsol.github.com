// CAUSAI Enhanced: Service Details Component - Lazy Loaded
import React from 'react';
import { Link } from 'react-router-dom';

const ServiceDetails = ({ service, onGetStarted }) => {
  if (!service) return null;

  return (
    <div className="service-content animate-in">
      <h3>{service.name}</h3>
      <p className="service-description">{service.description}</p>
      
      <div className="service-sections">
        <div className="service-section">
          <h4>Benefits</h4>
          <ul className="benefits-list">
            {service.benefits.map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        </div>
        
        <div className="service-section">
          <h4>Our Approach</h4>
          <ol className="process-list">
            {service.process.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
        
        <div className="service-section">
          <h4>Technologies</h4>
          <div className="tech-badges">
            {service.technologies.map((tech, idx) => (
              <span key={idx} className="tech-badge">{tech}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="service-cta">
        <Link 
          to="/contact" 
          className="service-cta-button"
          onClick={() => onGetStarted && onGetStarted(service)}
        >
          Discuss your {service.name.toLowerCase()} needs
        </Link>
      </div>
    </div>
  );
};

export default ServiceDetails;
