// Contact Icons - Font Awesome icons
import React from 'react';

export const EmailIcon = () => (
  <i className="fas fa-envelope"></i>
);

export const GlobeIcon = () => (
  <i className="fas fa-globe"></i>
);

export const LocationIcon = () => (
  <i className="fas fa-map-marker-alt"></i>
);

export const getContactIcon = (iconType) => {
  switch (iconType) {
    case 'email':
      return <EmailIcon />;
    case 'globe':
      return <GlobeIcon />;
    case 'location':
      return <LocationIcon />;
    default:
      return <EmailIcon />;
  }
};
