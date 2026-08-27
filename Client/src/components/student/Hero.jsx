import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className="hero">

      <h1>
        Empower your future with the courses designed to
        <span>
          fit your choice.
        </span>

        <img
          src={assets.sketch}
          alt="sketch"
        />
      </h1>


      {/* Desktop description */}

      <p className="hero-description desktop-description">
        We bring together world-class instructors, interactive content,
        and a supportive community to help you achieve your personal
        and professional goals.
      </p>


      {/* Mobile description */}

      <p className="hero-description mobile-description">
        We bring together world-class instructors, interactive content,
        and a supportive community to help you achieve your personal
        and professional goals.
      </p>


      <SearchBar />

    </div>
  )
}

export default Hero