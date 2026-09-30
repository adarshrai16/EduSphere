import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/educator/Sidebar';
import Navbar from '../../components/educator/Navbar';
import Footer from '../../components/educator/Footer';

const Educator = () => (
  <div className="educator">
    <Navbar />
    <div className="educator-body">
      <Sidebar />
      <main className="educator-main"><Outlet /></main>
    </div>
    <Footer />
  </div>
);

export default Educator;