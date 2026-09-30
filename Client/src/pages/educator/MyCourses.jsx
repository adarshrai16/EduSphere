import React,{useContext,useEffect,useState} from 'react';
import {AppContext} from '../../context/AppContext';
import axios from 'axios';
import {toast} from 'react-toastify';
import Loading from '../../components/student/Loading';

const MyCourses=()=>{
  const {backendUrl,isEducator,currency,getToken,fetchAllCourses}=useContext(AppContext);
  const [courses,setCourses]=useState(null);

  const fetchCourses=async()=>{
    try{
      const token=await getToken();
      const {data}=await axios.get(backendUrl+'/api/educator/courses',{headers:{Authorization:`Bearer ${token}`}});
      if(data.success)setCourses(data.courses);
    }catch(error){toast.error(error.message)}
  };

  const handleDelete=async course=>{
    if(!window.confirm(`Delete "${course.courseTitle}"? Enrolled students will lose access.`))return;
    try{
      const token=await getToken();
      const {data}=await axios.delete(`${backendUrl}/api/educator/courses/${course._id}`,{headers:{Authorization:`Bearer ${token}`}});
      if(data.success){
        setCourses(current=>current.filter(item=>item._id!==course._id));
        await fetchAllCourses();
        toast.success(data.message);
      }else toast.error(data.message);
    }catch(error){toast.error(error.response?.data?.message||error.message)}
  };

  useEffect(()=>{if(isEducator)fetchCourses()},[isEducator]);

  return courses?(
    <div className="courses-page">
      <h2>My Courses</h2>
      <div className="courses-table">
        <table>
          <thead>
            <tr>
              <th>All Courses</th><th>Earnings</th><th>Students</th><th>Published On</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course=>(
              <tr key={course._id}>
                <td className="course-name">
                  <img src={course.courseThumbnail} alt="Course"/>
                  <span>{course.courseTitle}</span>
                </td>
                <td>{currency} {Math.floor(course.enrolledStudents.length*(course.coursePrice-course.discount*course.coursePrice/100))}</td>
                <td>{course.enrolledStudents.length}</td>
                <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                <td><button type="button" onClick={()=>handleDelete(course)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ):<Loading/>;
};

export default MyCourses;