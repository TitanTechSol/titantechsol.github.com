// CAUSAI Enhanced: Advanced Loading States for Code Splitting
import React from 'react';

// Main page skeleton
export const PageSkeleton = () => (
  <div className="page-skeleton" style={{
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    animation: 'pulse 1.5s ease-in-out infinite alternate'
  }}>
    <div style={{
      height: '3rem',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      marginBottom: '2rem'
    }}></div>
    <div style={{
      height: '1.5rem',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      marginBottom: '1rem',
      width: '70%'
    }}></div>
    <div style={{
      height: '200px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      marginBottom: '2rem'
    }}></div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem'
    }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: '150px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px'
        }}></div>
      ))}
    </div>
    <style jsx>{`
      @keyframes pulse {
        0% { opacity: 1; }
        100% { opacity: 0.4; }
      }
    `}</style>
  </div>
);

// Team cards skeleton
export const TeamSkeleton = () => (
  <div className="team-skeleton" style={{ padding: '2rem' }}>
    <div style={{
      height: '3rem',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      marginBottom: '2rem',
      maxWidth: '400px',
      margin: '0 auto 2rem auto'
    }}></div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          animation: `pulse 1.5s ease-in-out infinite alternate ${i * 0.2}s`
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            backgroundColor: '#f0f0f0',
            borderRadius: '50%',
            margin: '0 auto 1rem auto'
          }}></div>
          <div style={{
            height: '1.5rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            marginBottom: '0.5rem'
          }}></div>
          <div style={{
            height: '1rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            width: '70%',
            margin: '0 auto'
          }}></div>
        </div>
      ))}
    </div>
    <style jsx>{`
      @keyframes pulse {
        0% { opacity: 1; }
        100% { opacity: 0.4; }
      }
    `}</style>
  </div>
);

// Services interactive skeleton
export const ServicesSkeleton = () => (
  <div className="services-skeleton" style={{ padding: '2rem' }}>
    <div style={{
      height: '3rem',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      marginBottom: '2rem',
      maxWidth: '600px',
      margin: '0 auto 2rem auto'
    }}></div>
    <div style={{
      height: '400px',
      backgroundColor: '#f0f0f0',
      borderRadius: '12px',
      marginBottom: '2rem',
      animation: 'pulse 1.5s ease-in-out infinite alternate'
    }}></div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem'
    }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{
          height: '200px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          animation: `pulse 1.5s ease-in-out infinite alternate ${i * 0.1}s`
        }}></div>
      ))}
    </div>
    <style jsx>{`
      @keyframes pulse {
        0% { opacity: 1; }
        100% { opacity: 0.4; }
      }
    `}</style>
  </div>
);

// Generic component skeleton
export const ComponentSkeleton = ({ height = '200px', animation = true }) => (
  <div style={{
    height,
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: '14px',
    animation: animation ? 'pulse 1.5s ease-in-out infinite alternate' : 'none'
  }}>
    Loading component...
    <style jsx>{`
      @keyframes pulse {
        0% { opacity: 1; }
        100% { opacity: 0.4; }
      }
    `}</style>
  </div>
);

export default {
  PageSkeleton,
  TeamSkeleton,
  ServicesSkeleton,
  ComponentSkeleton
};
