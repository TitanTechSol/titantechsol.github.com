import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import Home from './home';
import About from './about';
import Contact from './contact';
import Team from './team';
import ServicesInteractive from './services-interactive';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Check for stored redirect path and navigate to it
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      // Use React Router's navigate instead of manual history manipulation
      navigate('/' + redirectPath, { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <main id="content" style={{ flex: '1' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/team" element={<Team />} />
          <Route path="/services" element={<ServicesInteractive />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;