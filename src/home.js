import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServicesInteractive from './services-interactive';
import Testimonials from './testimonials';
import './css/main.css';

const Home = () => {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.home');
      if (window.scrollY > 20) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="home">
        <div className="greetings">
          <h1>TitanTech Solutions</h1>
          <h2>Software Design, Architecture, Development, and Testing</h2>
          <h3>Innovative, Secure, and Scalable Solutions</h3>
          <p>
            Titan Tech Solutions specializes in <strong>custom software design, architecture, development, and testing</strong> to help businesses build robust and efficient digital products.
          </p>
          <div className="cta-buttons">
            <Link to="/portfolio" className="primary-button">See Our Work</Link>
            <Link to="/contact" className="secondary-button">Get in Touch</Link>
          </div>
        </div>
      </div>
      
      <ServicesInteractive />
      
      <div className="process-section">
        <h2>How We Work</h2>
        <div className="process-container">
          <div className="process-step">
            <div className="process-number">1</div>
            <h3>Consultation</h3>
            <p>We begin by understanding your business needs and project goals, ensuring our solutions align with your vision.</p>
          </div>
          <div className="process-step">
            <div className="process-number">2</div>
            <h3>Design & Planning</h3>
            <p>Our team creates a tailored roadmap and architecture that serves as the foundation for your software solution.</p>
          </div>
          <div className="process-step">
            <div className="process-number">3</div>
            <h3>Development</h3>
            <p>We write clean, efficient code using industry best practices and modern development frameworks.</p>
          </div>
          <div className="process-step">
            <div className="process-number">4</div>
            <h3>Testing & QA</h3>
            <p>Rigorous testing ensures your software is secure, performant, and free of critical bugs before deployment.</p>
          </div>
          <div className="process-step">
            <div className="process-number">5</div>
            <h3>Deployment & Support</h3>
            <p>We handle the transition to production and provide ongoing maintenance to keep your software running smoothly.</p>
          </div>
        </div>
      </div>
      
      <Testimonials />
      
      <div className="tech-showcase">
        <h2>Our Technology Stack</h2>
        <p className="tech-intro">We leverage modern technologies to build robust, scalable software solutions.</p>
        <div className="tech-grid">
          <div className="tech-category">
            <h3>Frontend</h3>
            <div className="tech-items">
              <div className="tech-item">React</div>
              <div className="tech-item">Angular</div>
              <div className="tech-item">Vue.js</div>
              <div className="tech-item">TypeScript</div>
            </div>
          </div>
          <div className="tech-category">
            <h3>Backend</h3>
            <div className="tech-items">
              <div className="tech-item">.NET Core</div>
              <div className="tech-item">Node.js</div>
              <div className="tech-item">Java</div>
              <div className="tech-item">Python</div>
            </div>
          </div>
          <div className="tech-category">
            <h3>Cloud & DevOps</h3>
            <div className="tech-items">
              <div className="tech-item">Azure</div>
              <div className="tech-item">AWS</div>
              <div className="tech-item">Docker</div>
              <div className="tech-item">Kubernetes</div>
            </div>
          </div>
          <div className="tech-category">
            <h3>Testing</h3>
            <div className="tech-items">
              <div className="tech-item">Jest</div>
              <div className="tech-item">XUnit</div>
              <div className="tech-item">Cypress</div>
              <div className="tech-item">Selenium</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="home-cta">
        <h2>Ready to Transform Your Software?</h2>
        <p>Let's discuss how we can help you achieve your technology goals.</p>
        <Link to="/contact" className="cta-button">Contact Us Today</Link>
      </div>
    </>
  );
};

export default Home;