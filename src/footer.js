import React from 'react';
import { Link } from 'react-router-dom';
import './css/main.css';

const Footer = () => (
  <footer>
    <div className="footerLinks">
      <h2>Site Navigation</h2>
      <ul>
        <li><Link className="clickable-link" to="/">Home</Link></li>
        <li><Link className="clickable-link" to="/services">Services</Link></li>
        <li><Link className="clickable-link" to="/team">Our Team</Link></li>
        <li><Link className="clickable-link" to="/contact">Contact Us</Link></li>
      </ul>
    </div>
    
    <div className="footer-contact">
      <h2>Get in Touch</h2>
      <p><span className="footer-label">Email:</span> <a className="clickable-link" href="mailto:contactus@g2ad.com">contactus@g2ad.com</a></p>
      <p><span className="footer-label">Website:</span> <a className="clickable-link" href="https://www.TitanTech.g2ad.com">www.TitanTech.g2ad.com</a></p>
    </div>
    
    <ul className="attributions">
      <li style={{ textDecoration: 'underline', fontSize: '1.3em'}}>Company Info</li>
      <li>© 2024 TitanTech Solutions LLC.</li>
      <li>Innovative, Secure, Scalable Solutions</li>
    </ul>
  </footer>
);

export default Footer;
