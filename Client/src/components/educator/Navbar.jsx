import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { UserButton, useUser } from '@clerk/clerk-react';

const Navbar = ({ bgColor = '' }) => {
  const { isEducator } = useContext(AppContext);
  const { user } = useUser();

  if (!isEducator || !user) return null;

  return (
    <nav className={`educator-navbar ${bgColor}`}>
      <Link to="/" className="educator-navbar-logo">
        <img src={assets.logo} alt="Logo" />
      </Link>

      <div className="educator-navbar-user">
        <p>Hi! {user.fullName}</p>
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;

