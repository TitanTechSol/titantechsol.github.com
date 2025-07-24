import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/services-interactive.css';

const ServicesInteractive = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      id: 'architecture',
      name: 'Software Architecture & Design',
      icon: '🏗️',
      description: 'We create robust, scalable software architectures tailored to your business needs.',
      benefits: [
        'Future-proof systems that scale with your business',
        'Clean, maintainable code structure',
        'Optimized performance and resource usage',
        'Technology stack recommendations aligned with your goals'
      ],
      process: [
        'Requirements analysis',
        'System modeling and design',
        'Architecture documentation',
        'Technical specification development'
      ],
      technologies: ['Microservices', 'Serverless', 'Domain-Driven Design', 'Event-Sourcing', 'CQRS']
    },
    {
      id: 'development',
      name: 'Full-Stack Development',
      icon: '💻',
      description: 'End-to-end development of web, mobile, and desktop applications with modern technologies.',
      benefits: [
        'Cohesive experience across all platforms',
        'Accelerated development through modern frameworks',
        'Consistent code quality and practices',
        'Seamless integration between frontend and backend'
      ],
      process: [
        'Frontend development with reactive frameworks',
        'Backend API development',
        'Database design and implementation',
        'Integration with third-party services'
      ],
      technologies: ['React', 'Angular', '.NET Core', 'Node.js', 'SQL/NoSQL', 'RESTful APIs']
    },
    {
      id: 'testing',
      name: 'Automated & Manual Testing',
      icon: '🧪',
      description: 'Comprehensive testing strategies to ensure your software meets the highest quality standards.',
      benefits: [
        'Reduced defects in production',
        'Confidence in system reliability',
        'Faster release cycles',
        'Lower maintenance costs'
      ],
      process: [
        'Test strategy development',
        'Automated test suite creation',
        'Performance and load testing',
        'Security vulnerability testing'
      ],
      technologies: ['Jest', 'XUnit', 'Selenium', 'Cypress', 'JMeter', 'Postman']
    },
    {
      id: 'consulting',
      name: 'Consulting & Code Review',
      icon: '📋',
      description: 'Expert guidance and code quality assessment to optimize your development processes.',
      benefits: [
        'Identification of code smells and anti-patterns',
        'Best practice recommendations',
        'Performance optimization strategies',
        'Knowledge transfer to your team'
      ],
      process: [
        'Code base assessment',
        'Architecture evaluation',
        'Development process analysis',
        'Actionable improvement recommendations'
      ],
      technologies: ['Static Code Analysis', 'Performance Profiling', 'Technical Debt Assessment', 'Security Auditing']
    }
  ];

  return (
    <div className="services-interactive">
      <h2>Our Services</h2>
      <p className="services-intro">
        From concept to deployment, we provide comprehensive software solutions
        tailored to your unique business needs.
      </p>
      
      <div className="services-container">
        <div className="services-nav">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`service-nav-item ${activeService === service.id ? 'active' : ''}`}
              onClick={() => setActiveService(service.id)}
            >
              <span className="service-icon">{service.icon}</span>
              <span className="service-name">{service.name}</span>
            </div>
          ))}
        </div>
        
        <div className="service-details">
          {activeService ? (
            <div className="service-content animate-in">
              {services.filter(s => s.id === activeService).map(service => (
                <div key={service.id}>
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
                    <Link to="/contact" className="service-cta-button">
                      Discuss your {service.name.toLowerCase()} needs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="service-placeholder">
              <p>Select a service to learn more about our expertise and approach!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ServicesInteractive;