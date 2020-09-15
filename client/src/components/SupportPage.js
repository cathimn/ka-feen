import React from 'react';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

export default function () {

  return (
    <>
      <Navbar />
      <div className="container">
        <SidebarNav />
        <div className="content">
          <h3 className="content-header">Support</h3>
          <div className="content-break" />
        </div>
      </div>
    </>
  )
}
