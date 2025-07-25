import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Process from './Process';
import './css/main.css';

const Home = () => {
  const handleScroll = useCallback(() => {
    const header = document.querySelector('.home');
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    }
  }, []);

  useEffect(() => {
    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll]);

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
            <Link to="/contact" className="secondary-button">Get in Touch</Link>
          </div>
        </div>
      </div>
      
      <Process />

      <div className="home-cta">
        <h2>Ready to Transform Your Software?</h2>
        <p>Let's discuss how we can help you achieve your technology goals.</p>
        <Link to="/contact" className="cta-button">Contact Us Today</Link>
      </div>
    </>
  );
};

export default Home;