import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/about.css';

const About = () => {
  const [activeValue, setActiveValue] = useState(null);

  const coreValues = [
    {
      id: 'technical-excellence',
      title: 'Technical Excellence',
      icon: '🏆',
      description: 'We pursue mastery in software design, architecture, development, and testing.',
      examples: [
        'Continuous learning and skill development',
        'Staying current with emerging technologies and methodologies',
        'Rigorous code reviews and quality standards',
        'Building solutions that stand the test of time'
      ]
    },
    {
      id: 'innovation',
      title: 'Innovation',
      icon: '💡',
      description: 'We embrace cutting-edge technologies and methodologies to solve complex problems.',
      examples: [
        'Creative problem-solving approaches',
        'Exploring new tools and frameworks',
        'Challenging conventional thinking',
        'Finding elegant solutions to difficult challenges'
      ]
    },
    {
      id: 'integrity',
      title: 'Integrity',
      icon: '🤝',
      description: 'We build relationships based on transparency, honesty, and delivering on our promises.',
      examples: [
        'Clear and direct communication',
        'Setting realistic expectations',
        'Admitting mistakes and learning from them',
        'Ethical business practices in all interactions'
      ]
    },
    {
      id: 'client-focus',
      title: 'Client Focus',
      icon: '👥',
      description: 'We prioritize understanding our clients\' unique needs to create tailored solutions.',
      examples: [
        'Deep discovery process for each project',
        'Regular client feedback integration',
        'Solutions designed for specific business contexts',
        'Long-term partnership approach'
      ]
    },
    {
      id: 'quality',
      title: 'Quality',
      icon: '✓',
      description: 'We maintain rigorous standards throughout every phase of the software development lifecycle.',
      examples: [
        'Comprehensive testing at all stages',
        'Security-first development practices',
        'Performance optimization',
        'Well-documented, maintainable code'
      ]
    }
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Titan Tech Solutions</h1>
        <p className="about-intro">
          Founded by our experts with decades of combined experience, 
          Titan Tech Solutions delivers exceptional software solutions designed
          to transform your business operations and drive growth.
        </p>
      </section>
      
      <section className="mission-vision">
        <div className="mission-container">
          <div className="mission-card">
            <h2>Our Mission</h2>
            <p>
              We deliver robust, scalable, and intelligent software solutions by pairing cost-effective 
              developers with experts, enhanced by AI tools and practices. Our unique model blends the 
              innovation of emerging talent with deep technical leadership, ensuring clients receive 
              high-impact results with long-term value.
            </p>
          </div>
          
          <div className="mission-card">
            <h2>Our Vision</h2>
            <p>
              To be the trusted partner of choice for businesses seeking transformative software 
              solutions, known for our technical excellence, forward-thinking approach, and 
              unwavering commitment to client success.
            </p>
          </div>
        </div>
      </section>
      
      <section className="values-section">
        <h2>Our Core Values</h2>
        <p className="values-intro">
          These values guide every decision we make and every line of code we write.
        </p>
        
        <div className="values-explorer">
          {/* Values Navigation Panel */}
          <div className="values-nav">
            <h3>Core Values</h3>
            <div className="values-nav-list">
              {coreValues.map((value) => (
                <button
                  key={value.id}
                  className={`value-nav-item ${activeValue === value.id ? 'active' : ''}`}
                  onClick={() => setActiveValue(value.id)}
                >
                  <span className="value-icon">{value.icon}</span>
                  <div className="value-nav-text">
                    <span className="value-name">{value.title}</span>
                    <span className="value-short-desc">{value.description.split('.')[0]}.</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Values Details Panel */}
          <div className="values-details">
            {activeValue ? (
              <div className="value-content">
                {coreValues.filter(v => v.id === activeValue).map(value => (
                  <div key={value.id}>
                    <h3>
                      <span className="value-content-icon">{value.icon}</span>
                      {value.title}
                    </h3>
                    <p className="value-description">{value.description}</p>
                    
                    <div className="value-examples">
                      <h4>What this means in practice:</h4>
                      <ul>
                        {value.examples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="value-placeholder">
                <div className="placeholder-content">
                  <span className="placeholder-icon">👆</span>
                  <h3>Select a Core Value</h3>
                  <p>Choose a value from the left to learn more about our principles and how we apply them in practice.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Values Cards */}
        <div className="values-mobile">
          <div className="values-cards-grid">
            {coreValues.map((value) => (
              <div 
                key={value.id}
                className={`value-card ${activeValue === value.id ? 'active' : ''}`}
                onClick={() => setActiveValue(value.id)}
              >
                <div className="value-card-header">
                  <span className="value-card-icon">{value.icon}</span>
                  <h3>{value.title}</h3>
                </div>
                <p className="value-card-description">{value.description}</p>
                {activeValue === value.id && (
                  <div className="value-card-examples">
                    <h4>In practice:</h4>
                    <ul>
                      {value.examples.map((example, idx) => (
                        <li key={idx}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="team-overview">
        <h2>Our Expert Team</h2>
        <p className="team-intro">
          With decades of combined experience across diverse technology stacks and industries, 
          our team brings deep expertise to every project.
        </p>
        
        <div className="team-highlights">
          <div className="team-stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Years Combined Experience</span>
          </div>
          
          <div className="team-stat">
            <span className="stat-number">3</span>
            <span className="stat-label">Industry Veterans</span>
          </div>
          
          <div className="team-stat">
            <span className="stat-number">30+</span>
            <span className="stat-label">Technology Specializations</span>
          </div>
        </div>
        
        <div className="team-cta">
          <Link to="/team" className="team-button">Meet Our Team</Link>
        </div>
      </section>
      
      <section className="about-cta">
        <h2>Ready to Build Something Amazing?</h2>
        <p>Let's discuss how we can help transform your business with custom software solutions.</p>
        <div className="cta-buttons">
          <Link to="/services" className="primary-button">Explore Services</Link>
          <Link to="/contact" className="secondary-button">Contact Us</Link>
        </div>
      </section>
    </div>
  );
};

export default About;