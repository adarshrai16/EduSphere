import React,{useContext,useEffect,useState} from 'react'
import {AppContext} from '../../context/AppContext'
import YouTube from 'react-youtube'
import {assets} from '../../assets/assets'
import {useParams} from 'react-router-dom'
import humanizeDuration from 'humanize-duration'
import axios from 'axios'
import {toast} from 'react-toastify'
import Rating from '../../components/student/Rating'
import Footer from '../../components/student/Footer'
import Loading from '../../components/student/Loading'

const Player=()=>{
  const{enrolledCourses,backendUrl,getToken,calculateChapterTime,userData,fetchUserEnrolledCourses}=useContext(AppContext)
  const{courseId}=useParams()
  const[courseData,setCourseData]=useState(null),[progressData,setProgressData]=useState(null),[openSections,setOpenSections]=useState({}),[playerData,setPlayerData]=useState(null),[initialRating,setInitialRating]=useState(0)

  const getCourseData=()=>{
    enrolledCourses.forEach(course=>{
      if(course._id===courseId){
        setCourseData(course)
        course.courseRatings.forEach(item=>{
          if(item.userId===userData?._id)setInitialRating(item.rating)
        })
      }
    })
  }

  const toggleSection=i=>setOpenSections(p=>({...p,[i]:!p[i]}))

  const getCourseProgress=async()=>{
    try{
      const token=await getToken()
      const{data}=await axios.post(`${backendUrl}/api/user/get-course-progress`,{courseId},{headers:{Authorization:`Bearer ${token}`}})
      if(data.success)setProgressData(data.progressData)
      else toast.error(data.message)
    }catch(e){toast.error(e.message)}
  }

  const markLectureAsCompleted=async lectureId=>{
    try{
      const token=await getToken()
      const{data}=await axios.post(`${backendUrl}/api/user/update-course-progress`,{courseId,lectureId},{headers:{Authorization:`Bearer ${token}`}})
      if(data.success){toast.success(data.message);getCourseProgress()}
      else toast.error(data.message)
    }catch(e){toast.error(e.message)}
  }

  const handleRate=async rating=>{
    try{
      const token=await getToken()
      const{data}=await axios.post(`${backendUrl}/api/user/add-rating`,{courseId,rating},{headers:{Authorization:`Bearer ${token}`}})
      if(data.success){toast.success(data.message);fetchUserEnrolledCourses()}
      else toast.error(data.message)
    }catch(e){toast.error(e.message)}
  }

  useEffect(()=>{if(enrolledCourses.length)getCourseData()},[enrolledCourses])
  useEffect(()=>{getCourseProgress()},[])

  return courseData?(
    <>
      <main className="player">
        <section className="course-structure">
          <h2>Course Structure</h2>

          <div className="chapters">
            {courseData.courseContent.map((chapter,index)=>{
              const open=openSections[index]

              return(
                <div className="chapter" key={index}>
                  <div className="chapter-head" onClick={()=>toggleSection(index)}>
                    <div>
                      <img
                        src={assets.down_arrow_icon}
                        className={open?'rotate':''}
                        alt=""
                      />
                      <span>{chapter.chapterTitle}</span>
                    </div>
                    <small>
                      {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                    </small>
                  </div>

                  {open&&(
                    <ul className="lecture-list">
                      {chapter.chapterContent.map((lecture,i)=>{
                        const completed=progressData?.lectureCompleted.includes(lecture.lectureId)

                        return(
                          <li key={i}>
                            <img src={completed?assets.blue_tick_icon:assets.play_icon} alt=""/>
                            <span>{lecture.lectureTitle}</span>

                            <div>
                              {lecture.lectureUrl&&(
                                <button
                                  onClick={()=>setPlayerData({...lecture,chapter:index+1,lecture:i+1})}
                                >
                                  Watch
                                </button>
                              )}
                              <small>
                                {humanizeDuration(lecture.lectureDuration*60000,{units:['h','m']})}
                              </small>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>

          <div className="rating-box">
            <h2>Rate this Course:</h2>
            <Rating initialRating={initialRating} onRate={handleRate}/>
          </div>
        </section>

        <section className="video-player">
          {playerData?(
            <>
              <YouTube
                iframeClassName="youtube"
                videoId={playerData.lectureUrl.split('/').pop()}
              />

              <div className="video-info">
                <p>
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button onClick={()=>markLectureAsCompleted(playerData.lectureId)}>
                  {progressData?.lectureCompleted.includes(playerData.lectureId)
                    ?'Completed'
                    :'Mark Complete'}
                </button>
              </div>
            </>
          ):(
            <img src={courseData.courseThumbnail} alt="course"/>
          )}
        </section>
      </main>

      <Footer/>
    </>
  ):<Loading/>
}

export default Player
