import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = () => {
  const navigationItems = [
    { label: 'Dashboard', to: '/educator', icon: assets.home_icon, end: true },
    { label: 'Add course', to: '/educator/addcourse', icon: assets.add_icon },
    { label: 'My courses', to: '/educator/mycourse', icon: assets.my_course_icon },
    { label: 'Students enrolled', to: '/educator/studentenrolled', icon: assets.person_tick_icon }
  ]

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white md:min-h-[calc(100vh-72px)] md:w-60 md:border-b-0 md:border-r">
      <div className="hidden px-6 pb-3 pt-8 md:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
      </div>
      <nav aria-label="Educator navigation" className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:gap-1.5 md:px-4 md:py-2">
        {navigationItems.map(({ label, to, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors md:w-full ${
                isActive
                  ? 'bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isActive ? 'bg-white' : 'bg-slate-100 group-hover:bg-white'}`}>
                  <img src={icon} alt="" className="h-4 w-4 object-contain" />
                </span>
                <span className="whitespace-nowrap">{label}</span>
                {isActive && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-blue-600 md:block" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mx-6 mt-5 hidden border-t border-slate-100 pt-5 md:block">
        <p className="text-xs leading-5 text-slate-500">Build lessons, manage your courses, and follow learner progress.</p>
      </div>
    </aside>
  )
}

export default Sidebar