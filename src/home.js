// filepath: /c:/Users/George Aaron Kibbie/Documents/GitHub/titantechsol.github.com/src/Header.js
import React from 'react';
import './css/main.css';

const Home = ({ navigate, toggleMenu, menuOpen }) => (
<div class="home">
    <div class="about-us">
        <h2>About Us</h2>
        <ul class="text-about-us">
            <strong>TitanTech Solutions</strong> is a dynamic vendor company specializing in:
            <ul>
                <li>Software Design</li>
                <li>Software Architecture</li>
                <li>Software Development</li>
                <li>Software Testing</li>
            </ul>
            What makes us unique:
            <ul>
                <li>We pair junior developers with highly experienced senior mentors.</li>
                <li>This approach ensures:
                    <ul>
                        <li>Innovative solutions fueled by fresh perspectives.</li>
                        <li>Guidance and precision from industry veterans.</li>
                    </ul>
                </li>
            </ul>
            Our commitment:
            <ul>
                <li>Delivering technically sound solutions.</li>
                <li>Crafting each project with precision and care.</li>
            </ul>
        </ul>
    </div>
    <div class="services">
        <h2>Our Services</h2>
        <ul>
            <li class="service">
                <h3>Mechanization</h3>
                <p>Automate routine tasks with cutting-edge AI technologies, boosting efficiency and reducing overhead.</p>
            </li>
            <li class="service">
                <h3>Modernization</h3>
                <p>Update outdated systems or processes.</p>
            </li>
            <li class="service">
                <h3>Mentorship</h3>
                <p>Support skill development and growth for individuals or teams.</p>
            </li>
        </ul>
    </div>
</div>
);

export default Home;