import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { useClerk, useUser } from '@clerk/react'

const CourseDetails = () => {

  const { id } = useParams()

  const {
    allCourses,
    calculateRating,
    currency,
    enrollCourse
} = useContext(AppContext)

  const [openChapter, setOpenChapter] = useState(0)

  // Find selected course
  const course = allCourses.find(
    course => course._id === id
  )

  // Course not found
  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course not found</h2>
      </div>
    )
  }

  // Calculate rating
  const rating = calculateRating(course)

  // Calculate discounted price
  const discountedPrice =
    course.coursePrice -
    (course.discount * course.coursePrice) / 100

    const { openSignIn } = useClerk()
const { user } = useUser()

  return (
    <div className="course-details-page">

      {/* ================= COURSE INFORMATION ================= */}

      <div className="course-details-container">

        {/* ================= LEFT SIDE ================= */}

        <div className="course-details-left">

          <p className="course-breadcrumb">
            Home / Course / {course.courseTitle}
          </p>

          <h1 className="course-details-title">
            {course.courseTitle}
          </h1>

          <div
            className="course-details-description"
            dangerouslySetInnerHTML={{
              __html: course.courseDescription
            }}
          />

          {/* ================= RATING ================= */}

          <div className="course-rating">

            <span className="rating-number">
              {rating.toFixed(1)}
            </span>

            <div className="rating-stars">

              {[...Array(5)].map((_, index) => (

                <img
                  key={index}
                  src={
                    index < Math.floor(rating)
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                />

              ))}

            </div>

            <span className="rating-count">
              ({course.courseRatings?.length || 0} ratings)
            </span>

          </div>

          {/* ================= EDUCATOR ================= */}

          <p className="course-educator">

            Created by{' '}

            <span>
              {course.educator?.name}
            </span>

          </p>

        </div>


        {/* ================= PURCHASE CARD ================= */}

        <div className="course-purchase-card">

          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="course-details-thumbnail"
          />

          <div className="course-purchase-content">

            <h2>
              {currency}
              {discountedPrice.toFixed(2)}
            </h2>

            <p className="original-price">
              {currency}
              {course.coursePrice.toFixed(2)}
            </p>

            <p className="discount-text">
              {course.discount}% off
            </p>

           <button
    className="enroll-button"
    onClick={() => {

        if (!user) {
            openSignIn()
            return
        }

        enrollCourse(course)

        alert('Course enrolled successfully!')

    }}
>
    Enroll Now
</button>

          </div>

        </div>

      </div>


      {/* ================= COURSE CURRICULUM ================= */}

      <div className="course-curriculum">

        <h2>
          Course Curriculum
        </h2>

        {course.courseContent?.map(
          (chapter, index) => (

            <div
              className="curriculum-chapter"
              key={chapter.chapterId || index}
            >

              {/* CHAPTER HEADER */}

              <div
                className="chapter-header"

                onClick={() =>
                  setOpenChapter(
                    openChapter === index
                      ? -1
                      : index
                  )
                }
              >

                <div className="chapter-title">

                  <span className="chapter-arrow">

                    {openChapter === index
                      ? '⌃'
                      : '⌄'
                    }

                  </span>

                  <h3>
                    Chapter {index + 1}:{' '}
                    {chapter.chapterTitle}
                  </h3>

                </div>

                <span>
                  {chapter.chapterContent?.length || 0}
                  {' '}lectures
                </span>

              </div>


              {/* LECTURES */}

              {openChapter === index && (

                <div className="chapter-lectures">

                  {chapter.chapterContent?.map(
                    (lecture, lectureIndex) => (

                      <div
                        className="lecture"
                        key={
                          lecture.lectureId ||
                          lectureIndex
                        }
                      >

                        <div className="lecture-left">

                          <span className="lecture-icon">
                            ▶
                          </span>

                          <span>
                            {lecture.lectureTitle}
                          </span>

                        </div>

                        <span className="lecture-duration">
                          {lecture.lectureDuration} min
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          )
        )}

      </div>


      {/* ================= WHAT YOU'LL LEARN ================= */}

      <div className="course-learn">

        <h2>
          What you'll learn
        </h2>

        <div className="learn-list">

          <div className="learn-item">
            <span>✓</span>
            <p>
              Build real-world projects from scratch
            </p>
          </div>

          <div className="learn-item">
            <span>✓</span>
            <p>
              Understand the fundamentals and advanced concepts
            </p>
          </div>

          <div className="learn-item">
            <span>✓</span>
            <p>
              Write clean and maintainable code
            </p>
          </div>

          <div className="learn-item">
            <span>✓</span>
            <p>
              Apply your knowledge to practical projects
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default CourseDetails