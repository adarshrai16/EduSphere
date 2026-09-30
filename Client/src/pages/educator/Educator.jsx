import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../../components/educator/SideBar';
import Navbar from '../../components/educator/Navbar';
import Footer from '../../components/educator/Footer';

const Educator = () => (
  <div className="educator">
    <Navbar />
    <div className="educator-body">
      <SideBar />
      <main className="educator-main"><Outlet /></main>
    </div>
    <Footer />
  </div>
);

export default Educator;