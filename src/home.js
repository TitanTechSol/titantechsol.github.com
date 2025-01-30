import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const menu = menuRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      menu.classList.add('active');
      startX = e.pageX - menu.offsetLeft;
      scrollLeft = menu.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      menu.classList.remove('active');
    };

    const handleMouseUp = () => {
      isDown = false;
      menu.classList.remove('active');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - menu.offsetLeft;
      const walk = (x - startX) * 3; // Scroll-fast
      menu.scrollLeft = scrollLeft - walk;
    };

    menu.addEventListener('mousedown', handleMouseDown);
    menu.addEventListener('mouseleave', handleMouseLeave);
    menu.addEventListener('mouseup', handleMouseUp);
    menu.addEventListener('mousemove', handleMouseMove);

    return () => {
      menu.removeEventListener('mousedown', handleMouseDown);
      menu.removeEventListener('mouseleave', handleMouseLeave);
      menu.removeEventListener('mouseup', handleMouseUp);
      menu.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="home">
      <div className="menu" ref={menuRef}>
        <div className="block">
          <h2>Our Services</h2>
          <ul>
            <li>Mechanization</li>
            <li>Modernization</li>
            <li>Mentorship</li>
          </ul>
        </div>
        <div className="block">
        </div>
        <div className="block">
        </div>
        <div className="block">
        </div>
      </div>
    </div>
  );
};

export default Home;