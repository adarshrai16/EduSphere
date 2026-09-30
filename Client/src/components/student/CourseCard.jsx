import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext)
  const rating = calculateRating(course)

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => scrollTo(0, 0)}
      className="course-card"
    >
      <img
        src={course.courseThumbnail}
        alt={course.courseTitle}
        className="course-card-image"
      />

      <div className="course-card-content">
        <h3 className="course-card-title">
          {course.courseTitle}
        </h3>

        <p className="course-card-educator">
          {course.educator?.name || 'EduSphere'}
        </p>

        <div className="course-card-rating">
          <span className="rating-value">
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
            ({course.courseRatings?.length || 0})
          </span>
        </div>

        <p className="course-card-price">
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

