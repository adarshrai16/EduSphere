import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { toast } from 'react-toastify'
import axios from 'axios'


const Navbar = () => {
  const location = useLocation()
  const isCoursesListPage = location.pathname.includes('/course-list')

  const {
    backendUrl,
    isEducator,
    setIsEducator,
    navigate,
    getToken
  } = useContext(AppContext)

  const { openSignIn } = useClerk()
  const { user } = useUser()

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return
      }

      const token = await getToken()

      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (data.success) {
        toast.success(data.message)
        setIsEducator(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <nav className={`student-navbar ${isCoursesListPage ? 'navbar-white' : 'navbar-cyan'}`}>
      
      <img
        src={assets.logo}
        alt="Logo"
        className="student-navbar-logo"
        onClick={() => navigate('/')}
      />

      {/* Desktop */}
      <div className="navbar-desktop-menu">
        {user && (
          <div className="navbar-links">
            <button onClick={becomeEducator}>
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>

            <span className="navbar-divider">|</span>

            <Link to="/my-enrollments">
              My Enrollments
            </Link>
          </div>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="create-account-btn"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="navbar-mobile-menu">
        <div className="navbar-mobile-links">
          <button onClick={becomeEducator}>
            {isEducator ? 'Educator Dashboard' : 'Become Educator'}
          </button>

          {user && (
            <>
              <span>|</span>
              <Link to="/my-enrollments">
                My Enrollments
              </Link>
            </>
          )}
        </div>

        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="mobile-user-btn"
          >
            <img src={assets.user_icon} alt="Account" />
          </button>
        )}
      </div>

    </nav>
  )
}

export default Navbar