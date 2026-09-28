import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CourseList from './pages/student/CourseList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/student/Navbar'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const isEducatorRoute = useMatch('/educator/*')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loading label="Loading EduSphere..." />
  }

  return (
    <div className='text-default min-h-screen bg-white'>
      {!isEducatorRoute && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/courselist' element={<CourseList />} />
        <Route path='/courselist/:input' element={<CourseList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/myenrollments' element={<MyEnrollments />} />
        <Route path='/player/:courseid' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />

        <Route path='/educator' element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path='addcourse' element={<AddCourse />} />
          <Route path='mycourse' element={<MyCourses />} />
          <Route path='studentenrolled' element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
