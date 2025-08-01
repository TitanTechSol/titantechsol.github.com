import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import './css/services-interactive.css';
import { servicesData } from './data/servicesData';
import { ComponentSkeleton } from './components/LoadingStates';
import CodeSplitErrorBoundary from './components/CodeSplitErrorBoundary';

// CAUSAI Enhanced: Lazy load service card component for better performance
const ServiceCard = React.lazy(() => import('./components/ServiceCard'));

const ServicesInteractive = () => {
  const [activeService, setActiveService] = useState(null);

  const handleServiceClick = (serviceId) => {
    setActiveService(activeService === serviceId ? null : serviceId);
  };

  const handleGetStarted = (service) => {
    // Smooth scroll to contact section or redirect to contact page
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on same page, redirect with service context
      window.location.href = `/contact?service=${service.id}`;
    }
  };

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
  return (
    <div className="services-interactive">
      <h2>Our Services</h2>
      <p className="services-intro">
        From concept to deployment, we provide comprehensive software solutions
        tailored to your unique business needs.
      </p>
      
      <div className="services-container">
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
                  isActive={activeService === service.id}
                  onServiceClick={handleServiceClick}
                  onGetStarted={handleGetStarted}
                />
              ))}
            </div>
          </Suspense>
        </CodeSplitErrorBoundary>
        
        {!activeService && (
          <div className="service-placeholder">
            <p>Click on any service card to learn more about our expertise and approach!</p>
          </div>
        )}
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