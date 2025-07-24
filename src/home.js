import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Process from './Process';
import './css/main.css';

const Home = () => {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.home');
      if (window.scrollY > 20) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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