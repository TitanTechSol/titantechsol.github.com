import React, { useState } from 'react';
import './css/portfolio.css';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeProject, setActiveProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: 'Enterprise Microservice Architecture',
      description: 'Designed and implemented a scalable microservice architecture for a financial services company, improving system resilience and enabling continuous deployment.',
      category: 'architecture',
      image: '/photos/portfolio/project1.jpg', // Add project images to this directory
      technologies: ['.NET Core', 'Azure Service Bus', 'Docker', 'Kubernetes', 'CI/CD'],
      results: [
        '50% reduction in deployment time',
        'Improved system uptime from 99.5% to 99.95%',
        'Enabled independent scaling of services'
      ]
    },
    {
      id: 2,
      title: 'React E-commerce Platform',
      description: 'Developed a modern e-commerce solution with real-time inventory management, payment processing, and customer analytics.',
      category: 'development',
      image: '/photos/portfolio/project2.jpg',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Redux'],
      results: [
        'Increased conversion rate by 23%',
        'Reduced page load time by 40%',
        'Improved mobile experience with responsive design'
      ]
    },
    {
      id: 3,
      title: 'Automated Testing Framework',
      description: 'Created a comprehensive automated testing solution for a healthcare application, ensuring HIPAA compliance and system reliability.',
      category: 'testing',
      image: '/photos/portfolio/project3.jpg',
      technologies: ['Selenium', 'Jest', 'Cypress', 'GitHub Actions', 'XUnit'],
      results: [
        '90% reduction in regression testing time',
        'Identification of 35 critical bugs before production',
        'Enabled weekly release cycles'
      ]
    },
    {
      id: 4,
      title: 'Legacy System Modernization',
      description: 'Consulted on the modernization of a critical legacy system for a manufacturing client, providing a phased approach to migrate to current technologies.',
      category: 'consulting',
      image: '/photos/portfolio/project4.jpg',
      technologies: ['Architecture Assessment', 'Code Review', 'Migration Strategy', 'Performance Optimization'],
      results: [
        'Created comprehensive migration roadmap',
        'Identified and addressed 24 security vulnerabilities',
        'Improved system performance by 65%'
      ]
    },
    {
      id: 5,
      title: 'Real-time Analytics Dashboard',
      description: 'Built a real-time analytics dashboard for monitoring system performance and business metrics across multiple data sources.',
      category: 'development',
      image: '/photos/portfolio/project5.jpg',
      technologies: ['Angular', 'SignalR', 'D3.js', 'Azure Functions', 'SQL Server'],
      results: [
        'Reduced decision-making time by providing real-time insights',
        'Consolidated 7 different reporting tools into one platform',
        'Automated daily reporting tasks saving 20 hours per week'
      ]
    },
    {
      id: 6,
      title: 'Secure Payment Processing System',
      description: 'Designed and implemented a PCI-compliant payment processing system with robust security features and fraud detection.',
      category: 'architecture',
      image: '/photos/portfolio/project6.jpg',
      technologies: ['ASP.NET Core', 'SQL Server', 'Azure Key Vault', 'OAuth 2.0', 'Payment Gateway API'],
      results: [
        'Achieved PCI DSS Level 1 compliance',
        'Reduced fraudulent transactions by 89%',
        'Implemented tokenization for sensitive data protection'
      ]
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const handleProjectClick = (id) => {
    setActiveProject(activeProject === id ? null : id);
  };

  return (
    <div className="portfolio-section">
      <h2>Our Work</h2>
      <p className="portfolio-intro">
        We help businesses transform their ideas into powerful, scalable solutions. 
        Explore our case studies to see how we've helped our clients succeed.
      </p>
      
      <div className="portfolio-filters">
        <button 
          className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Projects
        </button>
        <button 
          className={`filter-button ${activeFilter === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveFilter('architecture')}
        >
          Architecture
        </button>
        <button 
          className={`filter-button ${activeFilter === 'development' ? 'active' : ''}`}
          onClick={() => setActiveFilter('development')}
        >
          Development
        </button>
        <button 
          className={`filter-button ${activeFilter === 'testing' ? 'active' : ''}`}
          onClick={() => setActiveFilter('testing')}
        >
          Testing
        </button>
        <button 
          className={`filter-button ${activeFilter === 'consulting' ? 'active' : ''}`}
          onClick={() => setActiveFilter('consulting')}
        >
          Consulting
        </button>
      </div>
      
      <div className="portfolio-grid">
        {filteredProjects.map(project => (
          <div 
            key={project.id} 
            className={`portfolio-item ${activeProject === project.id ? 'expanded' : ''}`}
            onClick={() => handleProjectClick(project.id)}
          >
            <div className="portfolio-image" style={{ backgroundImage: `url(${project.image})` }}>
              <div className="portfolio-overlay">
                <div className="portfolio-category">{project.category}</div>
                <div className="portfolio-expand">
                  {activeProject === project.id ? 'Close' : 'View Details'}
                </div>
              </div>
            </div>
            <div className="portfolio-content">
              <h3>{project.title}</h3>
              <p className="portfolio-description">{project.description}</p>
              
              {activeProject === project.id && (
                <div className="portfolio-details animate-in">
                  <div className="portfolio-tech">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="portfolio-tech-tag">{tech}</span>
                    ))}
                  </div>
                  
                  <div className="portfolio-results">
                    <h4>Results</h4>
                    <ul>
                      {project.results.map((result, index) => (
                        <li key={index}>{result}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
