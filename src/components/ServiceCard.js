// CAUSAI Enhanced: Flip Card Service Component
import React, { useState } from 'react';
import { getServiceIcon } from './ServiceIcons';

const ServiceCard = ({ service }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`service-flip-card ${isFlipped ? 'flipped' : ''}`}
      onClick={handleCardClick}
    >
      <div className="flip-card-inner">
        {/* Front of Card */}
        <div className="flip-card-front">
          <div className="service-icon">
            {getServiceIcon(service.id)}
          </div>
          <h3>{service.name}</h3>
          <p className="service-tagline">{service.tagline}</p>
        </div>
        
        {/* Back of Card */}
        <div className="flip-card-back">
          <h3>{service.name}</h3>
          <p className="service-description">{service.shortDescription}</p>
          <ul className="service-highlights">
            {service.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
