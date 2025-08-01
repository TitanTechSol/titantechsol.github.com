// CAUSAI Enhanced: Split Services Data from Interactive Component
export const servicesData = [
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
    description: 'From frontend to backend, we build complete web applications using modern technologies.',
    benefits: [
      'End-to-end development expertise',
      'Modern JavaScript frameworks (React, Vue, Angular)',
      'Responsive, mobile-first design',
      'API development and integration'
    ],
    process: [
      'Project planning and scope definition',
      'UI/UX design and prototyping',
      'Agile development with regular demos',
      'Testing, deployment, and maintenance'
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'REST APIs', 'GraphQL', 'MongoDB', 'PostgreSQL']
  },
  {
    id: 'testing',
    name: 'Quality Assurance & Testing',
    icon: '🧪',
    description: 'Comprehensive testing strategies to ensure your software is reliable and bug-free.',
    benefits: [
      'Automated testing pipelines',
      'Comprehensive test coverage',
      'Performance and load testing',
      'Cross-browser and device compatibility'
    ],
    process: [
      'Test strategy development',
      'Automated test suite creation',
      'Manual testing for edge cases',
      'Continuous integration testing'
    ],
    technologies: ['Jest', 'Cypress', 'Selenium', 'Playwright', 'JMeter', 'Postman']
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud Solutions',
    icon: '☁️',
    description: 'Streamlined deployment pipelines and cloud infrastructure management.',
    benefits: [
      'Automated CI/CD pipelines',
      'Scalable cloud infrastructure',
      'Monitoring and alerting systems',
      'Infrastructure as Code (IaC)'
    ],
    process: [
      'Infrastructure assessment',
      'Pipeline design and implementation',
      'Monitoring setup',
      'Documentation and training'
    ],
    technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Jenkins']
  }
];

export default servicesData;
