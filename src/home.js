import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './css/main.css';

const Home = () => {
  const menuRef = useRef(null);

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
    <div className="home">
      <div className="greetings">
        <h1>TitanTech Solutions</h1>
        <h2>Software Design, Architecture, Development, and Testing</h2>
        <h3>Innovative, Secure, and Scalable Solutions</h3>
        <p>
          Titan Tech Solutions specializes in <strong>custom software design, architecture, development, and testing</strong> to help businesses build robust and efficient digital products.
        </p>
        <h2>Why Choose Us?</h2>
        <ul>
          <li><strong>Expert Software Design</strong> – Tailored solutions that align with your business needs.</li>
          <li><strong>Scalable Architecture</strong> – Future-proof software systems built for performance.</li>
          <li><strong>End-to-End Development</strong> – From concept to deployment, we handle it all.</li>
          <li><strong>Rigorous Testing</strong> – Ensuring quality, security, and reliability at every step.</li>
        </ul>
        <h2>Our Services</h2>
        <ul>
          <li><strong>Software Architecture & Design</strong> – Structuring scalable, maintainable applications.</li>
          <li><strong>Full-Stack Development</strong> – Frontend, backend, and database solutions.</li>
          <li><strong>Automated & Manual Testing</strong> – Ensuring high-quality, bug-free software.</li>
          <li><strong>Code Review & Mentoring</strong> – Helping teams optimize and refine their codebase.</li>
        </ul>
        <h2>How We Work</h2>
        <ol>
          <li><strong>Consultation</strong> – Understanding your needs and defining project goals.</li>
          <li><strong>Design & Planning</strong> – Creating a tailored roadmap for your software.</li>
          <li><strong>Development</strong> – Writing clean, efficient, and scalable code.</li>
          <li><strong>Testing & QA</strong> – Validating functionality, security, and performance.</li>
          <li><strong>Deployment & Support</strong> – Ensuring smooth operation and ongoing maintenance.</li>
        </ol>
      </div>
    </div>
  );
};

export default Home;