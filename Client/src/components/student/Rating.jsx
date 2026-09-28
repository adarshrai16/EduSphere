import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'

const Rating = ({ courseId }) => {
  const [courseRating, setCourseRating] = useState(0)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)

  useEffect(() => {
    setCourseRating(Number(localStorage.getItem(`courseRating-${courseId}`)) || 0)
    setRatingSubmitted(false)
  }, [courseId])

  const submitCourseRating = () => {
    if (courseRating > 0) {
      localStorage.setItem(`courseRating-${courseId}`, String(courseRating))
      setRatingSubmitted(true)
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-800">Rate this course</h3>
      <p className="mt-1 text-sm text-gray-600">How would you rate your learning experience?</p>

      <div className="mt-3 flex flex-wrap items-center gap-1" role="group" aria-label="Choose a course rating">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => {
              setCourseRating(rating)
              setRatingSubmitted(false)
            }}
            aria-label={`${rating} out of 5 stars`}
            aria-pressed={courseRating === rating}
            className="rounded p-1 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <img
              src={assets.star}
              alt=""
              className={`h-7 w-7 ${rating <= courseRating ? 'opacity-100' : 'opacity-30 grayscale'}`}
            />
          </button>
        ))}

        <button
          type="button"
          onClick={submitCourseRating}
          disabled={courseRating === 0}
          className="ml-3 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Submit rating
        </button>
      </div>

      {ratingSubmitted && (
        <p className="mt-3 text-sm text-emerald-700" role="status">
          Your rating is saved on this device.
        </p>
      )}
    </div>
  )
}

export default Rating
