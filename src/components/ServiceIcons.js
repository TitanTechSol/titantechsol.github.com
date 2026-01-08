// Service Icons - Font Awesome icons
import React from 'react';

export const DevelopmentIcon = () => (
  <i className="fas fa-code"></i>
);

export const TestingIcon = () => (
  <i className="fas fa-check-circle"></i>
);

export const DevOpsIcon = () => (
  <i className="fas fa-cloud"></i>
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
