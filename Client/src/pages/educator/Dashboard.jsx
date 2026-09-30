import React,{useContext,useEffect,useState} from 'react';
import {assets} from '../../assets/assets';
import {AppContext} from '../../context/AppContext';
import axios from 'axios';
import {toast} from 'react-toastify';
import Loading from '../../components/student/Loading';

const Dashboard=()=>{
  const {backendUrl,isEducator,currency,getToken}=useContext(AppContext);
  const [dashboardData,setDashboardData]=useState(null);

  const fetchDashboardData=async()=>{
    try{
      const token=await getToken();
      const {data}=await axios.get(backendUrl+'/api/educator/dashboard',{headers:{Authorization:`Bearer ${token}`}});
      if(data.success)setDashboardData(data.dashboardData);
      else toast.error(data.message);
    }catch(error){toast.error(error.message);}
  };

  useEffect(()=>{if(isEducator)fetchDashboardData();},[isEducator]);

  return dashboardData?(
    <div className="dashboard">
      <div className="dashboard-content">

        <div className="stats">
          <div className="stat-card">
            <img src={assets.patients_icon} alt=""/>
            <div><p className="stat-number">{dashboardData.enrolledStudentsData.length}</p><p>Total Enrolments</p></div>
          </div>

          <div className="stat-card">
            <img src={assets.appointments_icon} alt=""/>
            <div><p className="stat-number">{dashboardData.totalCourses}</p><p>Total Courses</p></div>
          </div>

          <div className="stat-card">
            <img src={assets.earning_icon} alt=""/>
            <div><p className="stat-number">{currency}{Math.floor(dashboardData.totalEarnings)}</p><p>Total Earnings</p></div>
          </div>
        </div>

        <div className="enrolments">
          <h2>Latest Enrolments</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="number-col">#</th>
                  <th>Student Name</th>
                  <th>Course Title</th>
                </tr>
              </thead>

              <tbody>
                {dashboardData.enrolledStudentsData.map((item,index)=>(
                  <tr key={index}>
                    <td className="number-col">{index+1}</td>
                    <td className="student">
                      <img src={item.student.imageUrl} alt="Profile"/>
                      <span>{item.student.name}</span>
                    </td>
                    <td className="course-title">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  ):<Loading/>;
};

export default Dashboard;

