import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

    const { navigate, isEducator } = useContext(AppContext)

    const location = useLocation()

    const isCourseListPage =
        location.pathname.includes('/courselist')

    const { openSignIn } = useClerk()
    const { user } = useUser()

    return (
        <nav
            className={
                isCourseListPage
                    ? 'navbar navbar-course-list'
                    : 'navbar'
            }
        >

            {/* Logo */}

            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt="Logo"
                className="navbar-logo"
            />


            {/* Desktop */}

            <div className="navbar-desktop">

                <div className="navbar-links">

                    {user && (
                        <button
                            onClick={() => navigate('/educator')}
                        >
                            {isEducator
                                ? 'Educator Dashboard'
                                : 'Become Educator'
                            }
                        </button>
                    )}

                    {user && <span>|</span>}

                    {user && (
                        <Link to="/myenrollments">
                            My Enrollments
                        </Link>
                    )}

                </div>


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

            <div className="navbar-mobile">

                <div className="mobile-links">

                    {user && (
                        <>
                            <button
                                onClick={() => navigate('/educator')}
                            >
                                {isEducator
                                    ? 'Educator Dashboard'
                                    : 'Become Educator'
                                }
                            </button>

                            <span>|</span>

                            <Link to="/myenrollments">
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
                        className="mobile-login-btn"
                    >
                        <img
                            src={assets.user_icon}
                            alt="User"
                        />
                    </button>
                )}

            </div>

        </nav>
    )
}

export default Navbar