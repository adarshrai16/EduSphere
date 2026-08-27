import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CourseSection = () => {

    const { allCourses } = useContext(AppContext)

    return (
        <div className="course-section">

            <h2>
                Learn from the best
            </h2>

            <p className="course-section-description">
                Discover our top-rated courses across various categories.
                From coding and design to
                <br />
                business and wellness, our courses are crafted to
                deliver results.
            </p>


            <div className="course-section-grid">

                {allCourses
                    .slice(0, 4)
                    .map((course, index) => (
                        <CourseCard
                            key={index}
                            course={course}
                        />
                    ))
                }

            </div>


            <Link
                to="/courselist"
                onClick={() => scrollTo(0, 0)}
                className="show-all-courses"
            >
                Show all courses
            </Link>

        </div>
    )
}

export default CourseSection