// filepath: /c:/Users/George Aaron Kibbie/Documents/GitHub/titantechsol.github.com/src/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './css/main.css';

const Header = ({ toggleMenu, menuOpen }) => (
  <header>
    <div className="header-content">
      <h1><Link className="clickable-link" to="/">TitanTech Solutions</Link></h1>
      <nav className="nav-bar">
        <button className="nav-button" type="button" onClick={toggleMenu}>
          <div className="hamburger">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </button>
        <ul className="nav-links" id="nav-links" style={{ display: menuOpen ? 'block' : 'none' }}>
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About Us</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}>Contact Us</Link></li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;