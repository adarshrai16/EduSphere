import React, { useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { useClerk, useUser } from '@clerk/react'
import Footer from '../../components/student/Footer'
import YouTube from 'react-youtube'


const CourseDetails = () => {

  const { id } = useParams()

  const {
    allCourses,
    enrolledCourses,
    calculateRating,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    enrollCourse
  } = useContext(AppContext)

  const [openChapter, setOpenChapter] = useState(0)
  const [previewVideo, setPreviewVideo] = useState(null)

  const extractVideoId = (url) => {
    if (!url) return null

    try {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
      return match ? match[1] : null
    } catch {
      return null
    }
  }

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
  const isAlreadyEnrolled = enrolledCourses.some(item => item._id === course._id)
  const previewVideoId = previewVideo ? extractVideoId(previewVideo.lectureUrl) : null


  return (
    <div className="course-details-page">

      {/*COURSE INFORMATION*/}

      <div className="course-details-container">

        {/*LEFT SIDE*/}

        <div className="course-details-left">

          <nav className="course-breadcrumb" aria-label="Breadcrumb">
            <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link to="/" className="text-slate-500 transition hover:text-blue-700">Home</Link>
              </li>
              <li aria-hidden="true" className="text-slate-300">/</li>
              <li>
                <Link to="/courselist" className="text-slate-500 transition hover:text-blue-700">Course</Link>
              </li>
              <li aria-hidden="true" className="text-slate-300">/</li>
              <li aria-current="page" title={course.courseTitle} className="max-w-[60vw] truncate font-medium text-slate-800 sm:max-w-sm">
                {course.courseTitle}
              </li>
            </ol>
          </nav>

          <h1 className="course-details-title">
            {course.courseTitle}
          </h1>

          <div
            className="course-details-description"
            dangerouslySetInnerHTML={{
              __html: course.courseDescription
            }}
          />

          {/*RATING*/}

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

          {/*EDUCATOR*/}

          <p className="course-educator">

            Created by{' '}

            <span>
              {course.educator?.name}
            </span>

          </p>

        </div>


        {/*PURCHASE CARD*/}

        <div className="course-purchase-card">

          {previewVideoId ? (
            <div className="mb-4">
              <YouTube
                videoId={previewVideoId}
                opts={{
                  width: '100%',
                  height: '260',
                  playerVars: {
                    autoplay: 0,
                    controls: 1,
                    rel: 0
                  }
                }}
                className="w-full"
              />
            </div>
          ) : (
            <img
              src={course.courseThumbnail}
              alt={course.courseTitle}
              className="course-details-thumbnail"
            />
          )}

         

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
          </div>

          <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-600'>
            <div className='flex items-center gap-1'>
              <img src={assets.star} alt="star icon" />
              <p>{calculateRating(course).toFixed(1)}</p>
            </div>

            <div className='h-4 w-px bg-gray-500/40'></div>

            <div className='flex items-center gap-1'>
              <img src={assets.time_clock_icon} alt="clock icon" />
              <p>{calculateCourseDuration(course)}</p>
            </div>

            <div className='h-4 w-px bg-gray-500/40'></div>

            <div className='flex items-center gap-1'>
              <img src={assets.lesson_icon} alt="lesson icon" />
              <p>{calculateNoOfLectures(course)} lessons</p>
            </div>
          </div>

          <button
            className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium"
            onClick={() => {
              if (!user) {
                openSignIn()
                return
              }

              if (isAlreadyEnrolled) {
                return
              }

              enrollCourse(course)
              alert('Course enrolled successfully!')
            }}
          >
            {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
          </button>

          <div className="pt-6">
            <p className="md:text-xl text-lg font-medium text-gray-800">What's in the course?</p>
            <ul className="m-4 pt-2 text-sm md:text-default list-disc text-gray-500">
              <li>Lifetime access with free updates.</li>
              <li>Step-by-step, hands-on project guidance.</li>
              <li>Download resources and source code.</li>
              <li>Quizzers to test your knowledge.</li>
              <li>Certificate of completion.</li>
            </ul>
          </div>

        </div>

      </div>


      {/*COURSE CURRICULUM*/}

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

                        <div className="flex items-center gap-2">
                          {lecture.isPreviewFree && (
                            <button
                              type="button"
                              className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-medium"
                              onClick={() => setPreviewVideo(lecture)}
                            >
                              Preview
                            </button>
                          )}

                          <span className="lecture-duration">
                            {lecture.lectureDuration} min
                          </span>
                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          )
        )}

      </div>


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
      <Footer/>

    </div>
  )
}

export default CourseDetails