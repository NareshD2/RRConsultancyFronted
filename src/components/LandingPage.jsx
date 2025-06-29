import React from 'react';
import './LandingPage.css';
import {Link} from 'react-router-dom'


const LandingPage = () => {
  return (
      <div className="landing">
        <header className="hero-section" id="home">
          <div className="hero-content">
            <h1>Find Your Dream Property</h1>
            <p>
              At RR Consultancy, we bridge the gap between buyers and property owners.
              Whether you're looking for your forever home, a lucrative investment, or a commercial hub,
              we provide verified listings and unmatched support for your real estate journey.
            </p>
            <Link to="/dashboard" className="cta-button">Explore Properties</Link>
          </div>
        </header>

        <section className="features" id="features">
          <h2>What We Offer</h2>
          <p className="section-intro">
            A wide spectrum of properties tailored to your needs, whether for personal use, investment, or commercial purposes.
          </p>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>🏡 Houses</h3>
              <p>Choose from a range of modern and traditional homes in prime localities.</p>
            </div>
            <div className="feature-card">
              <h3>📐 Plots</h3>
              <p>Build your vision from the ground up with approved residential and commercial plots.</p>
            </div>
            <div className="feature-card">
              <h3>🏢 Buildings</h3>
              <p>Multi-floor residential apartments and commercial complexes for rent and sale.</p>
            </div>
            <div className="feature-card">
              <h3>🌱 Lands</h3>
              <p>Find fertile agricultural lands and industrial lots with clean ownership records.</p>
            </div>
          </div>
        </section>

        <section className="why-choose-us">
          <h2>Why Choose RR Consultancy?</h2>
          <ul>
            <li>✅ Verified listings with complete legal documentation</li>
            <li>✅ Transparent pricing with zero hidden charges</li>
            <li>✅ Personalized support from our real estate experts</li>
            <li>✅ Latest market insights and property trends</li>
            <li>✅ 24/7 access to property information and updates</li>
          </ul>
        </section>

        <section className="contact-section" id="contact">
          <h2>Get in Touch</h2>
          <p>Have questions or need help? Our experts are just a call or click away.</p>
          <p>
            📞 <strong>+91-9347522620</strong> <br />
            📧 <strong>rrconsultancy@email.com</strong>
          </p>
          <a href="/contact" className="cta-button secondary">Contact Us</a>
        </section>

        <footer className="footer">
          <p>&copy; 2025 RR Consultancy. All rights reserved.</p>
        </footer>
      </div>
    
  );
};

export default LandingPage;
