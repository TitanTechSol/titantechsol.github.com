import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import Home from './home';
import About from './about';
import Contact from './contact';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <main id="content" style={{ flex: '1' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;