import React from 'react';
import { Link } from 'react-router-dom';
import './css/main.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            We Build Scalable, Secure Software<br />
            That Grows With Your Business
          </h1>
          
          <p className="hero-subtitle">
            Custom Software • Architecture • Development • QA & Testing
          </p>
          
          <p className="hero-description">
            Engineering production-ready software for startups, SMBs, and growing enterprises.
          </p>
          
          <p className="hero-mission">
            TitanTech Solutions delivers custom software built for performance, security, and 
            long-term scalability. We partner with businesses to design, develop, and test reliable 
            products that solve real problems.
          </p>
          
          <div className="hero-buttons">
            <Link to="/contact" className="btn-primary">Request a Free Consultation</Link>
            <Link to="/services" className="btn-secondary">View Our Services</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">Trusted, Performance-Driven Applications</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>Secure & Scalable Solutions</h3>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Senior Development Team</h3>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h3>Security-First Approach</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;