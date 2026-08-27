import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <div className="testimonials-section">

      <h2>
        Testimonials
      </h2>

      <p className="testimonials-description">
        Hear from our learners as they share their journeys of transformation,
        success, and how our
        <br />
        platform has made a difference in their lives.
      </p>


      <div className="testimonials-grid">

        {dummyTestimonial.map((testimonial, index) => (

          <div
            key={index}
            className="testimonial-card"
          >

            {/* User information */}

            <div className="testimonial-user">

              <img
                src={testimonial.image}
                alt={testimonial.name}
              />

              <div>

                <h1>
                  {testimonial.name}
                </h1>

                <p>
                  {testimonial.role}
                </p>

              </div>

            </div>


            {/* Testimonial content */}

            <div className="testimonial-content">

              {/* Stars */}

              <div className="testimonial-stars">

                {[...Array(5)].map((_, i) => (

                  <img
                    key={i}
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                  />

                ))}

              </div>


              {/* Feedback */}

              <p>
                {testimonial.feedback}
              </p>

            </div>


            {/* Read more */}

            <a
              href="#"
              className="read-more"
            >
              Read more
            </a>

          </div>

        ))}

      </div>

    </div>
  )
}

export default TestimonialsSection