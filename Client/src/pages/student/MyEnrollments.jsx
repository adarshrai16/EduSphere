import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Line } from 'rc-progress'
import Footer from '../../components/student/Footer'
import { Link } from 'react-router-dom'

const dummyProgressArray = [
  { lectureCompleted: 2, totalLectures: 4 },
  { lectureCompleted: 1, totalLectures: 5 },
  { lectureCompleted: 3, totalLectures: 6 },
  { lectureCompleted: 4, totalLectures: 4 },
  { lectureCompleted: 0, totalLectures: 3 },
  { lectureCompleted: 5, totalLectures: 7 },
  { lectureCompleted: 6, totalLectures: 8 },
  { lectureCompleted: 2, totalLectures: 6 },
  { lectureCompleted: 4, totalLectures: 10 },
  { lectureCompleted: 3, totalLectures: 5 },
  { lectureCompleted: 7, totalLectures: 7 },
  { lectureCompleted: 1, totalLectures: 4 },
  { lectureCompleted: 0, totalLectures: 2 },
  { lectureCompleted: 5, totalLectures: 5 }
]

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    completedLectures,
    currency
  } = useContext(AppContext)

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>

        {enrolledCourses.length === 0 ? (
          <div className="mt-10 rounded border border-dashed border-gray-300 p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700">You haven't enrolled in any courses yet.</h2>
            <Link to="/courselist" className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white">
              Browse Courses
            </Link>
          </div>
        ) : (
          <table className="mt-10 w-full table-fixed overflow-hidden border md:table-auto">
            <thead className="max-sm:hidden text-left text-sm text-gray-900">
              <tr className="border-b border-gray-500/20">
                <th className="px-4 py-3 font-semibold truncate">Course</th>
                <th className="px-4 py-3 font-semibold truncate">Duration</th>
                <th className="px-4 py-3 font-semibold truncate">Completed</th>
                <th className="px-4 py-3 font-semibold truncate">Status</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {enrolledCourses.map((course, index) => {
                const totalLectures = course.courseContent?.reduce(
                  (total, chapter) => total + (chapter.chapterContent?.length || 0),
                  0
                ) || 0

                const completedLectureCount = course.courseContent?.reduce(
                  (total, chapter) =>
                    total +
                    (chapter.chapterContent?.filter((lecture) => completedLectures.includes(lecture.lectureId)).length || 0),
                  0
                ) || 0

                const dummyProgress = dummyProgressArray[index] || { lectureCompleted: 0, totalLectures: 1 }
                const progress = totalLectures > 0
                  ? Math.min(100, Math.round((dummyProgress.lectureCompleted / dummyProgress.totalLectures) * 100))
                  : 0

                const discountedPrice = course.coursePrice - (course.discount * course.coursePrice) / 100

                return (
                  <tr key={course._id || index} className="border-b border-gray-500/20">
                    <td className="flex items-center space-x-3 py-3 pl-2 md:px-4 md:pl-4">
                      <img src={course.courseThumbnail} alt={course.courseTitle} className="w-14 md:w-28 sm:w-24" />
                      <div className="flex-1">
                        <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                        <Line
                          percent={progress}
                          strokeWidth={2}
                          trailWidth={2}
                          strokeColor="#2563eb"
                          trailColor="#e5e7eb"
                          className="rounded-full"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3 max-sm:hidden">{calculateCourseDuration(course)}</td>

                    <td className="px-4 py-3 max-sm:hidden">
                      {dummyProgress.lectureCompleted}/{dummyProgress.totalLectures} Lectures
                    </td>

                    <td className="px-4 py-3 max-sm:text-right">
                      <button
                        className="bg-blue-600 px-3 py-1.5 text-white max-sm:text-xs sm:px-5 sm:py-2"
                        onClick={() => navigate(`/player/${course._id}`)}
                      >
                        {progress >= 100 ? 'Completed' : 'On Going'}
                      </button>

                      <p className="mt-2 text-sm text-gray-600">
                        {currency}
                        {discountedPrice.toFixed(2)}
                      </p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </>
  )
}

export default MyEnrollments