import React from 'react'
import { Outlet } from 'react-router-dom'

import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Fotter'

const Educator = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Educator