import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/educator',
      icon: assets.home_icon,
    },
    {
      name: 'Add Course',
      path: '/educator/add-course',
      icon: assets.add_icon,
    },
    {
      name: 'My Courses',
      path: '/educator/my-courses',
      icon: assets.my_course_icon,
    },
    {
      name: 'Student Enrolled',
      path: '/educator/student-enrolled',
      icon: assets.person_tick_icon,
    },
  ];

  if (!isEducator) return null;

  return (
    <aside className="educator-sidebar">
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === '/educator'}
          className={({ isActive }) =>
            `educator-sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <img src={item.icon} alt="" />
          <p>{item.name}</p>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;

