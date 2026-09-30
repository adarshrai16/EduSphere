import React,{useContext,useEffect,useState} from 'react';
import Footer from '../../components/student/Footer';
import {assets} from '../../assets/assets';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {AppContext} from '../../context/AppContext';
import {toast} from 'react-toastify';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import {useAuth} from '@clerk/clerk-react';
import Loading from '../../components/student/Loading';

const CourseDetails=()=>{
  const {id}=useParams();
  const [courseData,setCourseData]=useState(null),[playerData,setPlayerData]=useState(null),[isAlreadyEnrolled,setIsAlreadyEnrolled]=useState(false);
  const [openSections,setOpenSections]=useState({});
  const {backendUrl,currency,userData,calculateChapterTime,calculateCourseDuration,calculateRating,calculateNoOfLectures}=useContext(AppContext);
  const {getToken}=useAuth();

  const fetchCourse=async()=>{
    try{
      const {data}=await axios.get(backendUrl+'/api/course/'+id);
      if(data.success)setCourseData(data.courseData);else toast.error(data.message);
    }catch(error){toast.error(error.message)}
  };

  const toggleSection=i=>setOpenSections(p=>({...p,[i]:!p[i]}));

  const enrollCourse=async()=>{
    try{
      if(!userData)return toast.warn('Login to Enroll');
      if(isAlreadyEnrolled)return toast.warn('Already Enrolled');
      const token=await getToken();
      const {data}=await axios.post(backendUrl+'/api/user/purchase',{courseId:courseData._id},{headers:{Authorization:`Bearer ${token}`}});
      if(data.success)window.location.replace(data.session_url);else toast.error(data.message);
    }catch(error){toast.error(error.message)}
  };

  useEffect(()=>{fetchCourse()},[id]);

  useEffect(()=>{
    if(userData&&courseData)setIsAlreadyEnrolled((userData.enrolledCourses||[]).some(id=>String(id)===String(courseData._id)));
  },[userData,courseData]);

  if(!courseData)return <Loading/>;

  const rating=calculateRating(courseData);
  const price=(courseData.coursePrice-courseData.discount*courseData.coursePrice/100).toFixed(2);

  return <>
    <div className="course-details">
      <div className="course-bg"/>
      <section className="course-info">
        <h1>{courseData.courseTitle}</h1>
        <p className="course-short" dangerouslySetInnerHTML={{__html:courseData.courseDescription.slice(0,200)}}/>

        <div className="course-rating">
          <span>{rating}</span>
          <div className="stars">
            {[...Array(5)].map((_,i)=><img key={i} src={i<Math.floor(rating)?assets.star:assets.star_blank} alt=""/>)}
          </div>
          <span className="rating-count">({courseData.courseRatings.length} {courseData.courseRatings.length>1?'ratings':'rating'})</span>
          <span>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length>1?'students':'student'}</span>
        </div>

        <p className="course-by">Course by <span>{courseData.educator.name}</span></p>

        <div className="structure">
          <h2>Course Structure</h2>
          <div className="chapters">
            {courseData.courseContent.map((chapter,index)=>(
              <div className="chapter" key={index}>
                <div className="chapter-head" onClick={()=>toggleSection(index)}>
                  <div>
                    <img src={assets.down_arrow_icon} className={openSections[index]?'rotate':''} alt=""/>
                    <span>{chapter.chapterTitle}</span>
                  </div>
                  <small>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</small>
                </div>

                {openSections[index]&&<ul className="lectures">
                  {chapter.chapterContent.map((lecture,i)=>(
                    <li key={i}>
                      <img src={assets.play_icon} alt=""/>
                      <span>{lecture.lectureTitle}</span>
                      <div>
                        {lecture.isPreviewFree&&<button onClick={()=>setPlayerData({videoId:lecture.lectureUrl.split('/').pop()})}>Preview</button>}
                        <small>{humanizeDuration(lecture.lectureDuration*60000,{units:['h','m']})}</small>
                      </div>
                    </li>
                  ))}
                </ul>}
              </div>
            ))}
          </div>
        </div>

        <div className="description">
          <h2>Course Description</h2>
          <div className="rich-text" dangerouslySetInnerHTML={{__html:courseData.courseDescription}}/>
        </div>
      </section>

      <aside className="purchase-card">
        {playerData?<YouTube videoId={playerData.videoId} opts={{playerVars:{autoplay:1}}} iframeClassName="video"/>:<img className="course-thumbnail" src={courseData.courseThumbnail} alt=""/>}

        <div className="purchase-content">
          <p className="offer"><img src={assets.time_left_clock_icon} alt=""/> <span>5 days</span> left at this price!</p>

          <div className="price">
            <strong>{currency}{price}</strong>
            <del>{currency}{courseData.coursePrice}</del>
            <span>{courseData.discount}% off</span>
          </div>

          <div className="course-stats">
            <span>⭐ {rating}</span><i/>
            <span>◷ {calculateCourseDuration(courseData)}</span><i/>
            <span>▣ {calculateNoOfLectures(courseData)} lessons</span>
          </div>

          <button className="enroll-btn" onClick={enrollCourse}>
            {isAlreadyEnrolled?'Already Enrolled':'Enroll Now'}
          </button>

          <div className="includes">
            <h3>What's in the course?</h3>
            <ul>
              <li>Lifetime access with free updates.</li>
              <li>Step-by-step, hands-on project guidance.</li>
              <li>Downloadable resources and source code.</li>
              <li>Quizzes to test your knowledge.</li>
              <li>Certificate of completion.</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
    <Footer/>
  </>;
};

export default CourseDetails;

