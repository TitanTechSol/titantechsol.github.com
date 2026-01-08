import React, { useState } from 'react';
import './css/process.css';

const Process = () => {
  const [activeCard, setActiveCard] = useState(0);

  const processSteps = [
    {
      number: 1,
      title: "Consultation",
      description: "We begin by understanding your business needs and project goals, ensuring our solutions align with your vision."
    },
    {
      number: 2,
      title: "Design & Planning",
      description: "Our team creates a tailored roadmap and architecture that serves as the foundation for your software solution."
    },
    {
      number: 3,
      title: "Development",
      description: "We write clean, efficient code using industry best practices and modern development frameworks."
    },
    {
      number: 4,
      title: "Testing & QA",
      description: "Rigorous testing ensures your software is secure, performant, and free of critical bugs before deployment."
    },
    {
      number: 5,
      title: "Deployment & Support",
      description: "We handle the transition to production and provide ongoing maintenance to keep your software running smoothly."
    }
  ];

  const handleCardClick = (index) => {
    if (index === activeCard) {
      // If clicking the active card, go to next card
      handleNext();
    } else {
      // Otherwise, set the clicked card as active
      setActiveCard(index);
    }
  };

  const handlePrevious = () => {
    setActiveCard((prev) => (prev === 0 ? processSteps.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveCard((prev) => (prev === processSteps.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="process-section">
      <h2>How We Work</h2>
      <div className="process-deck-container">
        <div className="card-deck">
          {processSteps.map((step, index) => (
            <div
              key={step.number}
              className={`process-card ${index === activeCard ? 'active' : ''} ${index < activeCard ? 'previous' : ''}`}
              style={{ 
                zIndex: processSteps.length - Math.abs(index - activeCard),
                transform: `translateX(-50%) translateY(calc(-50% + ${(index - activeCard) * 15}px)) scale(${index === activeCard ? 1 : 0.94 - Math.abs(index - activeCard) * 0.03})`,
                left: `calc(50% + ${(index - activeCard) * 25}px)`
              }}
              onClick={() => handleCardClick(index)}
            >
              <div className="process-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="deck-navigation">
          <button className="nav-btn prev" onClick={handlePrevious}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="card-indicators">
            {processSteps.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === activeCard ? 'active' : ''}`}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
          <button className="nav-btn next" onClick={handleNext}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Process;
