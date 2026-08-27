import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-content">

        {/* Logo & Description */}

        <div className="footer-section footer-brand">

          <img
            src={assets.logo_dark}
            alt="logo"
          />

          <p>
            Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text.
          </p>

        </div>


        {/* Company */}

        <div className="footer-section footer-company">

          <h2>
            Company
          </h2>

          <ul>

            <li>
              <a href="#">
                Home
              </a>
            </li>

            <li>
              <a href="#">
                About us
              </a>
            </li>

            <li>
              <a href="#">
                Contact us
              </a>
            </li>

            <li>
              <a href="#">
                Privacy policy
              </a>
            </li>

          </ul>

        </div>


        {/* Newsletter */}

        <div className="footer-section footer-newsletter">

          <h2>
            Subscribe to our newsletter
          </h2>

          <p>
            The latest news, articles, and resources,
            sent to your inbox weekly.
          </p>


          <div className="newsletter-form">

            <input
              type="email"
              placeholder="Enter your email"
            />

            <button>
              Subscribe
            </button>

          </div>

        </div>

      </div>


      {/* Copyright */}

      <p className="footer-copyright">
        Copyright 2026 © EduSphere. All Right Reserved.
      </p>

    </footer>
  )
}

export default Footer