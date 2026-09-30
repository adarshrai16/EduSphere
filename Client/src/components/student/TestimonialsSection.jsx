import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <h2>Testimonials</h2>

      <p className="testimonials-subtitle">
        Hear from our learners as they share their journeys of transformation,
        success, and how our platform has made a difference in their lives.
      </p>

      <div className="testimonials-grid">
        {dummyTestimonial.map((testimonial, index) => (
          <div className="testimonial-card" key={index}>
            <div className="testimonial-user">
              <img
                src={testimonial.image}
                alt={testimonial.name}
              />

              <div>
                <h3>{testimonial.name}</h3>
                <p>{testimonial.role}</p>
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

              <p>{testimonial.feedback}</p>
            </div>

            <a href="#">Read more</a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;

