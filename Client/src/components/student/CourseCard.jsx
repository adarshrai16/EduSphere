import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {

  const { currency, calculateRating } = useContext(AppContext)

  const rating = calculateRating(course)

  const finalPrice =
    course.coursePrice - (course.discount * course.coursePrice) / 100

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => scrollTo(0, 0)}
      className="course-card"
    >

      {/* Course image */}
      <img
        src={course.courseThumbnail}
        alt={course.courseTitle}
        className="course-thumbnail"
      />

      <div className="course-card-content">

        {/* Course title */}
        <h3 className="course-title">
          {course.courseTitle}
        </h3>

        {/* Rating */}
        <div className="course-rating">

          <span className="rating-number">
            {rating.toFixed(1)}
          </span>

          <div className="rating-stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={i < Math.floor(rating)
                  ? assets.star
                  : assets.star_blank}
                alt=""
              />
            ))}
          </div>

          <span className="rating-count">
            ({course.courseRatings.length})
          </span>

        </div>

        {/* Price */}
        <p className="course-price">
          {currency}{finalPrice.toFixed(2)}
        </p>

      </div>

    </Link>
  )
}

export default CourseCard