import React,{useContext,useEffect,useState} from 'react';
import {assets} from '../../assets/assets';
import {AppContext} from '../../context/AppContext';
import axios from 'axios';
import {toast} from 'react-toastify';
import Loading from '../../components/student/Loading';
import { Link } from 'react-router-dom';

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

  if(!dashboardData)return <Loading/>;

  const enrolments=dashboardData.enrolledStudentsData||[];

  return(
    <div className="dashboard">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">EDUCATOR OVERVIEW</p>
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">Your courses and student activity at a glance.</p>
          </div>
        </header>

        <section className="dashboard-metrics" aria-label="Course overview">
          <article className="dashboard-metric">
            <span className="dashboard-metric-icon"><img src={assets.patients_icon} alt=""/></span>
            <div className="dashboard-metric-copy">
              <p className="dashboard-metric-label">Total Enrolments</p>
              <p className="dashboard-metric-value">{enrolments.length.toLocaleString()}</p>
            </div>
          </article>

          <article className="dashboard-metric">
            <span className="dashboard-metric-icon"><img src={assets.appointments_icon} alt=""/></span>
            <div className="dashboard-metric-copy">
              <p className="dashboard-metric-label">Total Courses</p>
              <p className="dashboard-metric-value">{dashboardData.totalCourses.toLocaleString()}</p>
            </div>
          </article>

          <article className="dashboard-metric">
            <span className="dashboard-metric-icon"><img src={assets.earning_icon} alt=""/></span>
            <div className="dashboard-metric-copy">
              <p className="dashboard-metric-label">Total Earnings</p>
              <p className="dashboard-metric-value">{currency}{Math.floor(dashboardData.totalEarnings).toLocaleString()}</p>
            </div>
          </article>
        </section>

        <section className="dashboard-enrolments">
          <div className="dashboard-section-heading">
            <div>
              <h2>Latest Enrolments</h2>
              <p>Students who have joined your courses.</p>
            </div>
            <span>{enrolments.length} {enrolments.length===1?'student':'students'}</span>
          </div>

          <div className="dashboard-table-container">
            <table>
              <thead>
                <tr>
                  <th className="dashboard-number-col">#</th>
                  <th>Student Name</th>
                  <th>Course Title</th>
                </tr>
              </thead>

              <tbody>
                {enrolments.length ? enrolments.map((item,index)=>(
                    <tr key={`${item.student?._id||item.student?.name}-${item.courseTitle}-${index}`}>
                      <td className="dashboard-number-col">{index+1}</td>
                      <td className="dashboard-student">
                        <img src={item.student?.imageUrl} alt=""/>
                        <span>{item.student?.name||'Student'}</span>
                      </td>
                      <td className="dashboard-course-title">{item.courseTitle}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="dashboard-empty-cell" colSpan="3">
                        <div className="dashboard-empty-state">
                          <p>No enrolments yet</p>
                          <span>When students join a course, they’ll appear here.</span>
                          <Link to="/educator/add-course">
                            <img src={assets.add_icon} alt=""/>
                            Add a course
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

