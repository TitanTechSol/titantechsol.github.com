import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/header.css';

const Header = ({ toggleMenu, menuOpen }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header-content');
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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header>
      <div className="header-content">
        <div className="header-title">
          <h1 className="title"><Link className="clickable-link" to="/">TitanTech </Link>{windowWidth > 600 && <a>Solutions</a>}</h1>
          {windowWidth > 600 && <p className="motto">Build. Innovative. Educate.</p>}
        </div>
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
};

export default Header;