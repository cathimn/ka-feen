import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

export default function () {
  const loggedIn = useSelector((store) => store.authentication.token);
  const [supported, setSupported] = useState([]);
  console.log(supported)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/supports`, {
        headers: { Authorization: `Bearer ${loggedIn}` },
      });
      const responseData = await response.json();
      setSupported(responseData.supported);
    }
    fetchData();
  }, [loggedIn])

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
          <div>
            Received Given
            {supported.map(support =>
            <div style={{ margin: "25px 0px" }}>
                <div style={{ backgroundImage: `url(${support.author_avatar})`}} className="post-avatar"></div>
                <span>{support.private_supporter || support.supporter}</span>
                <span>{support.posted_on}</span>
                <p>{support.body}</p>
                <span>Amount: $ {support.amount * 3}</span>
                <div className="content-break" />
            </div>)}
          </div>
        </div>
      </div>
    </>
  )
}
