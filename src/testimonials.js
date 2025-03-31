import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/testimonials.css';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Placeholder testimonial or empty array to trigger the "be the first" message
  const testimonials = [];
  // When you have real testimonials, replace the empty array above with your testimonial data

  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);
  
  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };
  
  const handlePrevClick = () => {
    setActiveIndex(prevIndex => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  const handleNextClick = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
  };

  // If there are no testimonials or just the placeholder, show the "be the first" message
  if (testimonials.length === 0) {
    return (
      <div className="testimonials-section">
        <h2>Client Testimonials</h2>
        <div className="testimonials-empty-state">
          <div className="empty-state-icon">⭐</div>
          <h3>Be Our First Success Story!</h3>
          <p>
            We're ready to help turn your software vision into reality. 
            Let us tackle your challenges and create a solution that exceeds your expectations.
          </p>
          <div className="empty-state-cta">
            <Link to="/contact" className="primary-button">Get Started Today</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonials-section">
      <h2>Client Testimonials</h2>
      <div className="testimonials-container">
        <button className="testimonial-nav prev" onClick={handlePrevClick}>
          &#10094;
        </button>
        
        <div className="testimonials-carousel">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className={`testimonial-card ${index === activeIndex ? 'active' : ''}`}
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
                opacity: index === activeIndex ? 1 : 0
              }}
            >
              <div className="testimonial-content">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author-container">
                  <div className="testimonial-avatar" style={{ backgroundImage: `url(${testimonial.avatar})` }}></div>
                  <div className="testimonial-author-info">
                    <p className="testimonial-author">{testimonial.author}</p>
                    <p className="testimonial-position">{testimonial.position}</p>
                    <p className="testimonial-company">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="testimonial-nav next" onClick={handleNextClick}>
          &#10095;
        </button>
      </div>
      
      <div className="testimonial-indicators">
        {testimonials.map((_, index) => (
          <button 
            key={index} 
            className={`testimonial-indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleIndicatorClick(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
