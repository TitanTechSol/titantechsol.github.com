import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './css/header.css';

const Header = ({ toggleMenu, menuOpen }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const menuRef = useRef(null);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.closest('.nav-button')) {
        toggleMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen, toggleMenu]);

  // Close menu and navigate
  const handleNavLinkClick = () => {
    if (menuOpen) {
      toggleMenu();
    }
  };

  return (
    <header>
      <div className="header-content">
        <div className="header-title">
          <h1 className="title"><Link className="clickable-link" to="/">TitanTech </Link>{windowWidth > 700 && <Link className="clickable-link" to="/">Solutions</Link>}</h1>
          {windowWidth > 700 && <p className="motto">Build. Innovative. Educate.</p>}
        </div>
        <nav className="nav-bar">
          <div className='popuplinks'>
            {windowWidth > 700 && <Link className="popLink" to="/">Home</Link>}
            {windowWidth > 700 && <Link className="popLink" to="/services">Services</Link>}
            {windowWidth > 700 && <Link className="popLink" to="/team">Team</Link>}
            {windowWidth > 700 && <Link className="popLink" to="/contact">Contact</Link>}
          </div>
          <button className="nav-button" type="button" onClick={toggleMenu}>
            <div className="hamburger">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </button>
          <div 
            ref={menuRef}
            className={`slide-menu ${menuOpen ? 'open' : ''}`}
          >
            <ul className="nav-links">
              <li><Link to="/" onClick={handleNavLinkClick}>Home</Link></li>
              <li><Link to="/services" onClick={handleNavLinkClick}>Services</Link></li>
              <li><Link to="/team" onClick={handleNavLinkClick}>Team</Link></li>
              <li><Link to="/contact" onClick={handleNavLinkClick}>Contact Us</Link></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;