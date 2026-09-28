import { useEffect, useState, createContext } from 'react'
import { dummyCourses } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const getInitialCourses = () => {
  const savedCourses = localStorage.getItem('educatorCourses')

  if (savedCourses === null) {
    return dummyCourses
  }

  try {
    const parsedCourses = JSON.parse(savedCourses)
    return Array.isArray(parsedCourses) ? parsedCourses : dummyCourses
  } catch {
    return dummyCourses
  }
}

export const AppContext = createContext() 

export const AppContextProvider = ({ children }) => {

  const navigate = useNavigate()

  const [allCourses, setAllCourses] = useState(getInitialCourses)
  const [isEducator, setIsEducator] = useState(true)
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const courseIds = new Set(getInitialCourses().map(course => course._id))
    return dummyCourses.filter(course => courseIds.has(course._id))
  })


  //fetch user enrolled courses
  const fetchEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses.filter(course => allCourses.some(item => item._id === course._id)))
  }
  
  
  
  
  
  
  const currency = '$'

  const [completedLectures, setCompletedLectures] = useState(() => {

    const savedLectures = localStorage.getItem('completedLectures')

    return savedLectures ? JSON.parse(savedLectures) : []
  })

  const calculateRating = (course) => {
    if (!course || !course.courseRatings || course.courseRatings.length === 0) {
      return 0
    }

    const totalRating = course.courseRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    )

    return totalRating / course.courseRatings.length
  }

  const calculateCourseDuration = (course) => {
    if (!course?.courseContent) return '0 min'

    const totalMinutes = course.courseContent.reduce((sum, chapter) => {
      const chapterMinutes = chapter.chapterContent?.reduce((chapterSum, lecture) => {
        return chapterSum + (lecture.lectureDuration || 0)
      }, 0) || 0

      return sum + chapterMinutes
    }, 0)

    return `${totalMinutes} min`
  }

  const calculateNoOfLectures = (course) => {
    if (!course?.courseContent) return 0

    return course.courseContent.reduce((sum, chapter) => {
      return sum + (chapter.chapterContent?.length || 0)
    }, 0)
  }

  const enrollCourse = (course) => {
    setEnrolledCourses(prev => {
      if (prev.some(item => item._id === course._id)) {
        return prev
      }

      return [...prev, course]
    })
  }

  const addCourse = (courseDetails) => {
    const course = {
      _id: `course-${Date.now()}`,
      courseTitle: courseDetails.courseTitle,
      courseDescription: courseDetails.courseDescription,
      coursePrice: Number(courseDetails.coursePrice),
      discount: Number(courseDetails.discount) || 0,
      courseThumbnail: courseDetails.courseThumbnail || dummyCourses[0]?.courseThumbnail,
      courseContent: [],
      educator: 'current-educator',
      enrolledStudents: [],
      courseRatings: [],
      isPublished: false
    }

    setAllCourses(prev => [course, ...prev])
    return course
  }

  const deleteCourse = (courseId) => {
    setAllCourses(prev => prev.filter(course => course._id !== courseId))
    setEnrolledCourses(prev => prev.filter(course => course._id !== courseId))
  }

  const markLectureCompleted = (lectureId) => {
    setCompletedLectures(prev => {
      if (prev.includes(lectureId)) {
        return prev
      }

      return [...prev, lectureId]
    })
  }

  const isLectureCompleted = (lectureId) => {
    return completedLectures.includes(lectureId)
  }
  
  useEffect(() => {
    localStorage.setItem('educatorCourses', JSON.stringify(allCourses))
  }, [allCourses])

  useEffect(() => {
    localStorage.setItem(
      'completedLectures',
      JSON.stringify(completedLectures)
    )
  }, [completedLectures])

  const value = {
    allCourses,
    navigate,
    calculateRating,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,

    isEducator,
    setIsEducator,

    enrolledCourses,
    fetchEnrolledCourses,
    enrollCourse,
    addCourse,
    deleteCourse,

    completedLectures,
    markLectureCompleted,
    isLectureCompleted
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}