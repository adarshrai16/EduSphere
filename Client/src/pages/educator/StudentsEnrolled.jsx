import React,{useContext,useEffect,useState} from 'react';
import axios from 'axios';
import {AppContext} from '../../context/AppContext';
import {toast} from 'react-toastify';
import Loading from '../../components/student/Loading';

const StudentsEnrolled=()=>{
  const {backendUrl,getToken,isEducator}=useContext(AppContext);
  const [students,setStudents]=useState(null);

  const fetchStudents=async()=>{
    try{
      const token=await getToken();
      const {data}=await axios.get(backendUrl+'/api/educator/enrolled-students',{headers:{Authorization:`Bearer ${token}`}});
      if(data.success)setStudents(data.enrolledStudents.reverse());
      else toast.error(data.message);
    }catch(error){toast.error(error.message)}
  };

  useEffect(()=>{if(isEducator)fetchStudents()},[isEducator]);

  return students?(
    <div className="students-page">
      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th className="number">#</th>
              <th>Student Name</th>
              <th>Course Title</th>
              <th className="date">Date</th>
            </tr>
          </thead>
          <tbody>
            {students.map((item,index)=>(
              <tr key={index}>
                <td className="number">{index+1}</td>
                <td className="student-name">
                  <img src={item.student.imageUrl} alt=""/>
                  <span>{item.student.name}</span>
                </td>
                <td>{item.courseTitle}</td>
                <td className="date">{new Date(item.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ):<Loading/>;
};

export default StudentsEnrolled;

