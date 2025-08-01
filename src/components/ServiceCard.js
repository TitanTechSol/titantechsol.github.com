// CAUSAI Enhanced: Service Card Component - Split for Code Optimization
import React from 'react';

const ServiceCard = ({ 
  service, 
  isActive, 
  onClick, 
  onGetStarted 
}) => {
  return (
    <div 
      className={`service-card ${isActive ? 'active' : ''}`}
      onClick={() => onClick && onClick(service)}
    >
      <div className="service-header">
        <span className="service-icon">{service.icon}</span>
        <h3>{service.name}</h3>
      </div>
      
      <p className="service-description">{service.description}</p>
      
      {isActive && (
        <div className="service-details">
          <div className="service-section">
            <h4>Benefits</h4>
            <ul>
              {service.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
          
          <div className="service-section">
            <h4>Our Process</h4>
            <ol>
              {service.process.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          
          <div className="service-section">
            <h4>Technologies</h4>
            <div className="technology-tags">
              {service.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
          
          <button 
            className="get-started-btn"
            onClick={(e) => {
              e.stopPropagation();
              onGetStarted(service);
            }}
          >
            Get Started with {service.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
