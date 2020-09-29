import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

const SupportCard = ({ type, support }) => (
  <div style={{ margin: "25px 0px" }}>
    <div style={{ display: "flex", marginBottom: "10px" }}>
      <div style={{ backgroundImage: `url(${support.author_avatar})` }} className="post-avatar"></div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>{support.private_supporter || support.supporter}</span>
        <span style={{ color: "gray" }}>{support.posted_on}</span>
      </div>
    </div>
    <span>Amount: ${support.amount * 3}</span><br/>
    {support.body ? <span>Message: {support.body}</span> : null}
    <div className="content-break" style={{ marginTop: "25px"}} />
  </div>
);

export default function () {
  const loggedIn = useSelector((store) => store.authentication.token);
  const [received, setReceived] = useState([]);
  const [given, setGiven] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/supports`, {
        headers: { Authorization: `Bearer ${loggedIn}` },
      });
      const responseData = await response.json();
      setReceived(responseData.received);
      setGiven(responseData.given)
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
            {received.map(support => <SupportCard key={support.id} type="received" support={support} />)}
            {given.map(support => <SupportCard key={support.id} type="given" support={support} />)}
          </div>
        </div>
      </div>
    </>
  )
}
