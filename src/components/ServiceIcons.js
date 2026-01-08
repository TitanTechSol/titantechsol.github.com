// Service Icons - SVG icons matching home page style
import React from 'react';

export const DevelopmentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
    <line x1="12" y1="2" x2="12" y2="22"></line>
  </svg>
);

export const TestingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

export const DevOpsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 9v.01"/>
    <path d="M12 15v.01"/>
    <path d="M9 12h.01"/>
    <path d="M15 12h.01"/>
  </svg>
);

export const getServiceIcon = (serviceId) => {
  switch (serviceId) {
    case 'development':
      return <DevelopmentIcon />;
    case 'testing':
      return <TestingIcon />;
    case 'devops':
      return <DevOpsIcon />;
    default:
      return <DevelopmentIcon />;
  }
};
