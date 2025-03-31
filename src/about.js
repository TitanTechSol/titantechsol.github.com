import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/about.css';
import './css/main.css';

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
          Founded by industry veterans with decades of combined experience, 
          Titan Tech Solutions delivers exceptional software solutions designed
          to transform your business operations and drive growth.
        </p>
      </section>
      
      <section className="mission-vision">
        <div className="mission-container">
          <div className="mission-card">
            <h2>Our Mission</h2>
            <p>
              Our mission at Titan Tech Solutions is to empower businesses through innovative, 
              secure, and scalable software solutions. We are dedicated to delivering exceptional 
              value through expert design, end-to-end development, and rigorous testing practices 
              that transform our clients' digital visions into reliable, high-performance realities.
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
        
        <div className="values-container">
          <div className="values-nav">
            {coreValues.map((value) => (
              <div 
                key={value.id}
                className={`value-nav-item ${activeValue === value.id ? 'active' : ''}`}
                onClick={() => setActiveValue(value.id)}
              >
                <span className="value-icon">{value.icon}</span>
                <span className="value-name">{value.title}</span>
              </div>
            ))}
          </div>
          
          <div className="value-details">
            {activeValue ? (
              <div className="value-content animate-in">
                {coreValues.filter(v => v.id === activeValue).map(value => (
                  <div key={value.id}>
                    <h3>{value.title}</h3>
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
                <p>Select a core value to learn more</p>
              </div>
            )}
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
            <span className="stat-number">15+</span>
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