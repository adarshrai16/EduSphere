import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const CoursesSection = () => {

  const { allCourses } = useContext(AppContext)

  return (
    <section className="home-courses">
      <h2 className="home-courses-title">Learn from the best</h2>
      <p className="home-courses-description">
        Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
      </p>
      <div className="home-course-grid">
        {allCourses.slice(0, 4).map((course, index) => <CourseCard key={index} course={course} />)}
      </div>
      <Link to={'/course-list'} onClick={() => scrollTo(0, 0)} className="all-courses-link">Show all courses</Link>
    </section>
  );
};

export default CoursesSection;
