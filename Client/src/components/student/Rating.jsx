import React, { useEffect, useState } from 'react'

const Rating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0)

  const handleRating = (value) => {
    setRating(value)
    if (onRate) onRate(value)
  }

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating)
    }
  }, [initialRating])

  return (
    <div className="rating">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1

        return (
          <span
            key={index}
            className={`rating-star ${
              starValue <= rating ? 'active' : ''
            }`}
            onClick={() => handleRating(starValue)}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}

export default Rating

