import React,{useContext,useEffect,useState} from 'react'
import {AppContext} from '../../context/AppContext'
import axios from 'axios'
import {Line} from 'rc-progress'
import {toast} from 'react-toastify'
import Footer from '../../components/student/Footer'

const MyEnrollments=()=>{
  const{userData,enrolledCourses,fetchUserEnrolledCourses,navigate,backendUrl,getToken,calculateCourseDuration,calculateNoOfLectures}=useContext(AppContext)
  const[progressArray,setProgressData]=useState([])

  const getCourseProgress=async()=>{
    try{
      const token=await getToken()
      const progress=await Promise.all(enrolledCourses.map(async course=>{
        const{data}=await axios.post(`${backendUrl}/api/user/get-course-progress`,{courseId:course._id},{headers:{Authorization:`Bearer ${token}`}})
        const totalLectures=calculateNoOfLectures(course)
        const lectureCompleted=data.progressData?.lectureCompleted.length||0
        return{totalLectures,lectureCompleted}
      }))
      setProgressData(progress)
    }catch(error){toast.error(error.message)}
  }

  useEffect(()=>{
    if(userData) fetchUserEnrolledCourses()
  },[userData])

  useEffect(()=>{
    if(enrolledCourses.length) getCourseProgress()
  },[enrolledCourses])

  return (
  <div className="enrollments-page">
    <main className="enrollments">
      <h1>My Enrollments</h1>

      <div className="enrollment-table">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Duration</th>
              <th>Completed</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {enrolledCourses.map((course, index) => {
              const progress = progressArray[index]
              const percent = progress
                ? (progress.lectureCompleted * 100) / progress.totalLectures
                : 0
              const completed =
                progress &&
                progress.lectureCompleted === progress.totalLectures

              return (
                <tr key={course._id}>
                  <td className="course-info">
                    <img src={course.courseThumbnail} alt="" />

                    <div>
                      <p>{course.courseTitle}</p>
                      <Line
                        className="progress-bar"
                        strokeWidth={2}
                        percent={percent}
                      />
                    </div>
                  </td>

                  <td className="hide-mobile">
                    {calculateCourseDuration(course)}
                  </td>

                  <td className="hide-mobile">
                    {progress &&
                      `${progress.lectureCompleted} / ${progress.totalLectures}`}
                    <span> Lectures</span>
                  </td>

                  <td className="status">
                    <button
                      onClick={() => navigate('/player/' + course._id)}
                    >
                      {completed ? 'Completed' : 'On Going'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>

    <Footer />
  </div>
)
}

export default MyEnrollments