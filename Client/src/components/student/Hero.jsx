import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from '../../components/student/SearchBar'


const Hero = () => {
  return (
    <section className="hero">
      <h1 className="hero-title">
        Empower your future with the courses designed to
        <span> fit your choice.</span>

        <img
          src={assets.sketch}
          alt="sketch"
          className="hero-sketch"
        />
      </h1>

      <p className="hero-description desktop-description">
        We bring together world-class instructors, interactive content, and a
        supportive community to help you achieve your personal and
        professional goals.
      </p>

      <p className="hero-description mobile-description">
        We bring together world-class instructors to help you achieve your
        professional goals.
      </p>

      <SearchBar />
    </section>
  )
}

export default Hero

