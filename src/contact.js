// filepath: /c:/Users/George Aaron Kibbie/Documents/GitHub/titantechsol.github.com/src/Header.js
import React from 'react';
import './css/main.css';

const Contact = ({ navigate, toggleMenu, menuOpen }) => (
<div className="home">
    <form class="contact-us" action="https://forms.zohopublic.com/titantechg21/form/Contactus/formperma/aByRelnjXAc7A67K9_kuqKwlPp7foYgIwVxICJHoW24/htmlRecords/submit" name="form" id="form" method="POST" accept-charset="UTF-8" enctype="multipart/form-data">
        <input type="hidden" name="zf_referrer_name" value="" />
        <input type="hidden" name="zf_redirect_url" value="" />
        <input type="hidden" name="zc_gad" value="" />
        
        <h2 style={{ textDecoration: 'underline'}}>Contact us</h2>

        <label for="name">Name <em class="required-feild">*</em></label>   
        <input type="text" id="name" name="SingleLine" maxlength="75" placeholder="Jane Doe" required />
        
        <label for="email">Email <em class="required-feild" >*</em></label>
        <input type="email" id="email" name="SingleLine1" maxlength="75" placeholder="Example@g2ad.com" required />
        
        <label for="message">Message <em class="required-feild" >*</em></label>
        <textarea id="message" name="MultiLine" maxlength="1000" placeholder="Hello World" required></textarea>
        
        <div class="button-container">
            <button type="submit"><em>Submit</em></button>
        </div>
        <p>Email: <a style={{color: 'var(--text-color)'}} href="mailto:contactus@g2ad.com">contactus@g2ad.com</a></p>
    </form>
</div>
);

export default Contact;