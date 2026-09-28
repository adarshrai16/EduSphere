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


            <div className="testimonial-content">


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


              <p>
                {testimonial.feedback}
              </p>

            </div>

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