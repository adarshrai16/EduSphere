import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const MyEnrollments = () => {

    const {
        enrolledCourses,
        currency,
        completedLectures
    } = useContext(AppContext)


    return (
        <div className="my-enrollments">

            <h1>My Enrollments</h1>

            <p className="enrollment-subtitle">
                Courses you have enrolled in
            </p>


            {enrolledCourses.length === 0 ? (

                <div className="no-enrollments">

                    <h2>
                        You haven't enrolled in any courses yet.
                    </h2>

                    <Link
                        to="/courselist"
                        className="browse-courses"
                    >
                        Browse Courses
                    </Link>

                </div>

            ) : (

                <div className="enrollment-list">

                    {enrolledCourses.map((course) => {

                        // Total number of lectures
                        const totalLectures =
                            course.courseContent?.reduce(
                                (total, chapter) =>
                                    total +
                                    (chapter.chapterContent?.length || 0),
                                0
                            ) || 0


                        // Number of completed lectures
                        const completedLectureCount =
                            course.courseContent?.reduce(
                                (total, chapter) =>
                                    total +
                                    (
                                        chapter.chapterContent?.filter(
                                            lecture =>
                                                completedLectures.includes(
                                                    lecture.lectureId
                                                )
                                        ).length || 0
                                    ),
                                0
                            ) || 0


                        // Calculate progress percentage
                        const progress =
                            totalLectures > 0
                                ? Math.round(
                                    (
                                        completedLectureCount /
                                        totalLectures
                                    ) * 100
                                )
                                : 0


                        // Calculate course price
                        const discountedPrice =
                            course.coursePrice -
                            (
                                course.discount *
                                course.coursePrice
                            ) / 100


                        return (

                            <div
                                className="enrollment-item"
                                key={course._id}
                            >

                                {/* Course Image */}

                                <img
                                    src={course.courseThumbnail}
                                    alt={course.courseTitle}
                                />


                                {/* Course Information */}

                                <div className="enrollment-info">

                                    <h2>
                                        {course.courseTitle}
                                    </h2>


                                    <p className="educator-name">
                                        {course.educator?.name}
                                    </p>


                                    {/* Progress */}

                                    <div className="progress-container">

                                        <div className="progress-top">

                                            <span>
                                                Course Progress
                                            </span>

                                            <span>
                                                {completedLectureCount}
                                                {' / '}
                                                {totalLectures}
                                                {' '}lectures
                                            </span>

                                        </div>


                                        <div className="progress-bar">

                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${progress}%`
                                                }}
                                            />

                                        </div>


                                        <p className="progress-percentage">
                                            {progress}% completed
                                        </p>

                                    </div>


                                    {/* Continue Learning */}

                                    <Link
                                        to={`/course/${course._id}/player`}
                                        className="continue-button"
                                    >
                                        Continue Learning
                                    </Link>

                                </div>


                                {/* Course Price */}

                                <div className="enrollment-price">

                                    <span>
                                        {currency}
                                        {discountedPrice.toFixed(2)}
                                    </span>

                                </div>

                            </div>

                        )

                    })}

                </div>

            )}

        </div>
    )
}

export default MyEnrollments