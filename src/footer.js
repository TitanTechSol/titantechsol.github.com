import React from 'react';
import { Link } from 'react-router-dom';
import './css/main.css';

const Footer = () => (
  <footer>
    <div className="footer-content">
      <ul className="footer-links">
        <li><Link className="clickable-link" to="/">Home</Link><a className='clickable-link'> | </a><Link className="clickable-link" to="/about">About Us</Link></li>
        <li><Link className="clickable-link" to="/contact">Contact Us</Link></li>
      </ul>
    </div>
  </footer>
);

export default Footer;
