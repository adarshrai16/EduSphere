import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        
        <div className="footer-brand">
          <img src={assets.logo} alt="Edusphere" />
          <p>
            Lorem ipsum is simply dummy text of the printing
            and typesetting industry.
          </p>
        </div>

        <div className="footer-company">
          <h2>Company</h2>
          <a href="/">Home</a>
          <a href="/about">About us</a>
          <a href="/contact">Contact us</a>
          <a href="/privacy-policy">Privacy policy</a>
        </div>

        <div className="footer-newsletter">
          <h2>Subscribe to our newsletter</h2>
          <p>
            The latest news, articles, and resources, sent to
            your inbox weekly.
          </p>

          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>

      </div>

      <div className="footer-bottom">
        Copyright 2025 © GreatStack. All Right Reserved.
      </div>
    </footer>
  );
};

export default Footer;