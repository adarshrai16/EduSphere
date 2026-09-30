import React, { useContext, useEffect, useState } from 'react'
import Footer from '../../components/student/Footer'
import { assets } from '../../assets/assets'
import CourseCard from '../../components/student/CourseCard'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import SearchBar from '../../components/student/SearchBar'

const CoursesList = () => {
  const { input } = useParams()
  const { allCourses, navigate } = useContext(AppContext)
  const [filteredCourse, setFilteredCourse] = useState([])

  useEffect(() => {
    const courses = input
      ? allCourses.filter(c => c.courseTitle.toLowerCase().includes(input.toLowerCase()))
      : allCourses
    setFilteredCourse(courses)
  }, [allCourses, input])

  return (
    <>
      <main className="courses-list">
        <div className="courses-head">
          <div>
            <h1>Course List</h1>
            <p>
              <span onClick={() => navigate('/')} className="home-link">Home</span>
              {' / '}Course List
            </p>
          </div>
          <SearchBar data={input} />
        </div>

        {input && (
          <div className="search-tag">
            <span>{input}</span>
            <img
              src={assets.cross_icon}
              onClick={() => navigate('/course-list')}
              alt="remove"
            />
          </div>
        )}

        <div className="course-grid">
          {filteredCourse.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default CoursesList

