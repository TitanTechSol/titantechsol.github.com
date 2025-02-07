import React from 'react';
import { Link } from 'react-router-dom';
import './css/main.css';

const Footer = () => (
  <footer>
    <div className="footerLinks">
      <h2>Links</h2>
      <ul>
        <li><Link className="clickable-link" to="/">Home</Link></li>
        <li><Link className="clickable-link" to="/about">About Us</Link></li>
        <li><Link className="clickable-link" to="/contact">Contact Us</Link></li>
      </ul>
    </div>
      <ul className="attributions">
        <li style={{ textDecoration: 'underline', fontSize: '1.3em'}}>Attributions</li>
        <li>© 2024 TitanTech Solutions LLC.</li>
        <li>Stock photos by <a href="https://www.vecteezy.com">Vecteezy.com</a></li>
      </ul>
  </footer>
);

export default Footer;
