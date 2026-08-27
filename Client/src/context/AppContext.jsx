import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import { dummyCourses } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()


    const [allCourses, setAllCourses] = useState([])

    const [isEducator, setIsEducator] = useState(true)


    // Enrolled courses
    const [enrolledCourses, setEnrolledCourses] = useState([])


    // Completed lectures
    const [completedLectures, setCompletedLectures] = useState(() => {

        const savedLectures =
            localStorage.getItem('completedLectures')

        return savedLectures
            ? JSON.parse(savedLectures)
            : []

    })


    // Fetch all courses
    const fetchAllcourses = async () => {

        setAllCourses(dummyCourses)

    }


    // Calculate rating
    const calculateRating = (course) => {

        if (
            !course.courseRatings ||
            course.courseRatings.length === 0
        ) {
            return 0
        }

        let totalRating = 0

        course.courseRatings.forEach(rating => {

            totalRating += rating.rating

        })

        return totalRating / course.courseRatings.length

    }


    // Enroll in course
    const enrollCourse = (course) => {

        setEnrolledCourses(prev => {

            const alreadyEnrolled = prev.some(
                enrolledCourse =>
                    enrolledCourse._id === course._id
            )

            if (alreadyEnrolled) {
                return prev
            }

            return [
                ...prev,
                course
            ]

        })

    }


    // Mark lecture completed
    const markLectureCompleted = (lectureId) => {

        setCompletedLectures(prev => {

            if (prev.includes(lectureId)) {
                return prev
            }

            return [
                ...prev,
                lectureId
            ]

        })

    }


    // Check lecture completed
    const isLectureCompleted = (lectureId) => {

        return completedLectures.includes(lectureId)

    }


    // Save completed lectures
    useEffect(() => {

        localStorage.setItem(
            'completedLectures',
            JSON.stringify(completedLectures)
        )

    }, [completedLectures])


    // Fetch courses
    useEffect(() => {

        fetchAllcourses()

    }, [])


    const value = {

        currency,

        allCourses,

        navigate,

        calculateRating,

        isEducator,
        setIsEducator,

        enrolledCourses,
        enrollCourse,

        completedLectures,
        markLectureCompleted,
        isLectureCompleted

    }


    return (

        <AppContext.Provider value={value}>

            {props.children}

        </AppContext.Provider>

    )
}