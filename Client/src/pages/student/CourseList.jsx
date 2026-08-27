import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import CourseCard from '../../components/student/CourseCard'

const CourseList = () => {
  const { navigate, allCourses } = useContext(AppContext)

  const [search, setSearch] = useState('')

  const filteredCourses = allCourses.filter((course) =>
    course.courseTitle.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="course-list-page">

      <div className="course-list-header">

        <div>
          <h1>Course List</h1>

          <p>
            <span
              className="home-link"
              onClick={() => navigate('/')}
            >
              Home
            </span>
            {' / '}
            <span>Course List</span>
          </p>
        </div>

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

      </div>

      <div className="course-grid">

        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
            />
          ))
        ) : (
          <p className="no-courses">
            No courses found.
          </p>
        )}

      </div>

    </div>
  )
}

export default CourseList