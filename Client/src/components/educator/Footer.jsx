import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <img
          src={assets.logo}
          alt="EduSphere"
          className="footer-logo"
        />

        <span className="footer-divider"></span>

        <p className="footer-copyright">
          © 2026 EduSphere. All rights reserved.
        </p>
      </div>

      <div className="footer-social">
        <a href="#" aria-label="Facebook">
          <img src={assets.facebook_icon} alt="Facebook" />
        </a>

        <a href="#" aria-label="Twitter">
          <img src={assets.twitter_icon} alt="Twitter" />
        </a>

        <a href="#" aria-label="Instagram">
          <img src={assets.instagram_icon} alt="Instagram" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;