import React from 'react';
import { Link } from 'react-router-dom';
import './css/main.css';

const About = () => (
<div className="home">
  <div className="card-container">
    <div className="card">
      <h2>Our Mission</h2>
      <p>
        At Titan Tech Solutions, our mission is to empower businesses with innovative, 
        scalable, and reliable technology solutions. We strive to deliver excellence in 
        every line of code and every interaction, ensuring our clients achieve their 
        goals with precision and confidence. By blending creativity with cutting-edge 
        technology, we turn challenges into opportunities and ideas into impactful realities.
      </p>
    </div>
    <div className="card">
      <h2>Our Values</h2>
      <ul>
        <li><strong>Integrity:</strong> We are dedicated to honest and transparent practices, building trust with our clients and within our team.</li>
        <li><strong>Innovation:</strong> We constantly seek new ways to improve and adapt, ensuring our solutions remain at the forefront of technology.</li>
        <li><strong>Collaboration:</strong> We believe in the power of teamwork and open communication to drive success.</li>
        <li><strong>Quality:</strong> From the smallest detail to the final delivery, we are committed to exceeding expectations and delivering work we're proud of.</li>
      </ul>
    </div>
    <div className="card">
      <h2>Our Team</h2>
      <p>
        Titan Tech Solutions is powered by a dynamic team of talented developers. With
        experienced senior developers and passionate junior developers eager to grow,
        we bring a balance of expertise and fresh perspectives to every project. Our
        team thrives on collaboration, leveraging years of front-end, back-end, and 
        software development experience to deliver exceptional results. Together, we 
        approach every challenge with a commitment to innovation and excellence.
      </p>
    </div>
  </div>
</div>
);

export default About;