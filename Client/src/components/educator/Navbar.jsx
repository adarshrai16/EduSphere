import React from 'react'
import { Link } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/react'
import { assets } from '../../assets/assets'

const Navbar = () => {
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7 lg:px-10">
      <div className="flex min-w-0 items-center gap-4 sm:gap-7">
        <Link to="/" aria-label="EduSphere home" className="shrink-0">
          <img src={assets.logo} alt="EduSphere" className="h-9 w-auto sm:h-10" />
        </Link>
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700">Educator workspace</p>
          <p className="truncate text-sm font-medium text-slate-600">Teach, track, and grow</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-xs text-slate-500">Signed in as</p>
          <p className="max-w-40 truncate text-sm font-semibold text-slate-800">
            {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Educator'}
          </p>
        </div>
        {user ? (
          <UserButton />
        ) : (
          <img src={assets.profile_img} alt="Educator profile" className="h-9 w-9 rounded-full border border-slate-200 object-cover" />
        )}
      </div>
    </header>
  )
}

export default Navbar