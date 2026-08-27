import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext)

  const rating = calculateRating(course)

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scrollTo(0, 0)}
      className="course-card"
    >
      <img
        src={course.courseThumbnail}
        alt={course.courseTitle}
        className="course-thumbnail"
      />

      <div className="course-card-content">

        <h3 className="course-title">
          {course.courseTitle}
        </h3>

        <div className="course-rating">
          <span className="rating-number">
            {rating.toFixed(1)}
          </span>

          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(rating)
                    ? assets.star
                    : assets.star_blank
                }
                alt=""
              />
            ))}
          </div>

          <span className="rating-count">
            ({course.courseRatings.length})
          </span>
        </div>

        <p className="course-price">
          {currency}
          {(
            course.coursePrice -
            (course.discount * course.coursePrice) / 100
          ).toFixed(2)}
        </p>

      </div>
    </Link>
  )
}

export default CourseCard