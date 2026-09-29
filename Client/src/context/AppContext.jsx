import { useEffect, useState, createContext } from 'react'
import { dummyCourses } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'

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

  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()

  const [allCourses, setAllCourses] = useState(getInitialCourses)

  const [isEducator, setIsEducator] = useState(true)

  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const courseIds = new Set(
      getInitialCourses().map(course => course._id)
    )

    return dummyCourses.filter(course =>
      courseIds.has(course._id)
    )
  })

  const [completedLectures, setCompletedLectures] = useState(() => {
    const savedLectures = localStorage.getItem('completedLectures')

    return savedLectures
      ? JSON.parse(savedLectures)
      : []
  })

  // Currency
  const currency = import.meta.env.VITE_CURRENCY || '₹'

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    setEnrolledCourses(
      dummyCourses.filter(course =>
        allCourses.some(item => item._id === course._id)
      )
    )
  }

  // Calculate course rating
  const calculateRating = (course) => {
    if (
      !course ||
      !course.courseRatings ||
      course.courseRatings.length === 0
    ) {
      return 0
    }

    const totalRating = course.courseRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    )

    return totalRating / course.courseRatings.length
  }

  // Calculate course duration
  const calculateCourseDuration = (course) => {
    if (!course?.courseContent) {
      return '0 min'
    }

    const totalMinutes = course.courseContent.reduce(
      (sum, chapter) => {
        const chapterMinutes =
          chapter.chapterContent?.reduce(
            (chapterSum, lecture) => {
              return (
                chapterSum +
                (lecture.lectureDuration || 0)
              )
            },
            0
          ) || 0

        return sum + chapterMinutes
      },
      0
    )

    return `${totalMinutes} min`
  }

  // Calculate number of lectures
  const calculateNoOfLectures = (course) => {
    if (!course?.courseContent) {
      return 0
    }

    return course.courseContent.reduce(
      (sum, chapter) => {
        return (
          sum +
          (chapter.chapterContent?.length || 0)
        )
      },
      0
    )
  }

  // Enroll course
  const enrollCourse = (course) => {
    setEnrolledCourses(prev => {
      if (
        prev.some(item => item._id === course._id)
      ) {
        return prev
      }

      return [...prev, course]
    })
  }

  // Add course
  const addCourse = (courseDetails) => {
    const course = {
      _id: `course-${Date.now()}`,
      courseTitle: courseDetails.courseTitle,
      courseDescription:
        courseDetails.courseDescription,
      coursePrice: Number(
        courseDetails.coursePrice
      ),
      discount:
        Number(courseDetails.discount) || 0,
      courseThumbnail:
        courseDetails.courseThumbnail ||
        dummyCourses[0]?.courseThumbnail,
      courseContent: [],
      educator: user?.id || 'current-educator',
      enrolledStudents: [],
      courseRatings: [],
      isPublished: false
    }

    setAllCourses(prev => [
      course,
      ...prev
    ])

    return course
  }

  // Delete course
  const deleteCourse = (courseId) => {
    setAllCourses(prev =>
      prev.filter(
        course => course._id !== courseId
      )
    )

    setEnrolledCourses(prev =>
      prev.filter(
        course => course._id !== courseId
      )
    )
  }

  // Mark lecture completed
  const markLectureCompleted = (lectureId) => {
    setCompletedLectures(prev => {
      if (prev.includes(lectureId)) {
        return prev
      }

      return [...prev, lectureId]
    })
  }

  // Check if lecture is completed
  const isLectureCompleted = (lectureId) => {
    return completedLectures.includes(lectureId)
  }

  // Save courses to localStorage
  useEffect(() => {
    localStorage.setItem(
      'educatorCourses',
      JSON.stringify(allCourses)
    )
  }, [allCourses])

  // Save completed lectures
  useEffect(() => {
    localStorage.setItem(
      'completedLectures',
      JSON.stringify(completedLectures)
    )
  }, [completedLectures])

  // Get Clerk token
  useEffect(() => {
    const logToken = async () => {
      try {
        if (!isSignedIn || !user) {
          console.log(
            'User is not signed in. No Clerk token available.'
          )
          return
        }

        const token = await getToken()

        console.log('Clerk User:', user)
        console.log('Clerk Token:', token)
      } catch (error) {
        console.error(
          'Error getting Clerk token:',
          error
        )
      }
    }

    logToken()
  }, [isSignedIn, user, getToken])

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
    isLectureCompleted,

    user,
    getToken,
    isSignedIn
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}