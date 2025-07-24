import React from 'react';
import './css/main.css';

const Contact = () => (
  <div className="contact-page">
    <div className="contact-header">
      <h1>Contact Us</h1>
      <p className="contact-intro">
        Ready to discuss your project or have questions about our services? 
        We're here to help turn your software vision into reality.
      </p>
    </div>
    
    <div className="contact-container">
      <div className="contact-info">
        <div className="info-card">
          <div className="info-icon">📧</div>
          <h3>Email Us</h3>
          <p><a href="mailto:contactus@g2ad.com">contactus@g2ad.com</a></p>
          <p className="info-description">We typically respond within 24 business hours.</p>
        </div>
        
        <div className="info-card">
          <div className="info-icon">🌐</div>
          <h3>Connect</h3>
          <p><a href="https://www.TitanTech.g2ad.com">www.TitanTech.g2ad.com</a></p>
          <p className="info-description">Learn more about our services and expertise.</p>
        </div>
        
        <div className="info-card">
          <div className="info-icon">🏢</div>
          <h3>Location</h3>
          <p>Draper, Utah</p>
          <p className="info-description">Serving clients remotely worldwide.</p>
        </div>
      </div>
      
      <form 
        className="contact-form" 
        action="https://forms.zohopublic.com/titantechg21/form/Contactus/formperma/aByRelnjXAc7A67K9_kuqKwlPp7foYgIwVxICJHoW24/htmlRecords/submit" 
        name="form" 
        id="form" 
        method="POST" 
        accept-charset="UTF-8" 
        encType="multipart/form-data"
      >
        <input type="hidden" name="zf_referrer_name" value="" />
        <input type="hidden" name="zf_redirect_url" value="" />
        <input type="hidden" name="zc_gad" value="" />
        
        <h2>Send us a message</h2>
        
        <div className="form-group">
          <label htmlFor="name">Name <span className="required-field">*</span></label>   
          <input 
            type="text" 
            id="name" 
            name="SingleLine" 
            maxLength="75" 
            placeholder="Your name" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email <span className="required-field">*</span></label>
          <input 
            type="email" 
            id="email" 
            name="SingleLine1" 
            maxLength="75" 
            placeholder="your.email@example.com" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message <span className="required-field">*</span></label>
          <textarea 
            id="message" 
            name="MultiLine" 
            maxLength="1000" 
            placeholder="Tell us about your project or inquiry..." 
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <button type="submit" className="submit-button">Send Message</button>
        </div>
      </form>
    </div>
    
    <div className="contact-cta">
      <h2>Let's Work Together</h2>
      <p>
        From concept to deployment, we're committed to delivering exceptional 
        software solutions that meet your unique business needs.
      </p>
    </div>
  </div>
);

export default Contact;