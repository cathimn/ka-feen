import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

export default function () {
  const loggedIn = useSelector((store) => store.authentication.token);

  if (!loggedIn) {
    return <Redirect to="/" />
  }

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
