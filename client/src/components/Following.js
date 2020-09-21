import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

const FollowCard = ({ user }) => (
  <>
    <div
      style={{
        padding: "20px 0px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex" }}>
        <div
          className="post-avatar"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(${user.avatar_url || "https://kafeen.s3.us-east-2.amazonaws.com/Screen+Shot+2020-09-20+at+11.52.11+PM.png"})` }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span>
            {user.display_name
            ? <>{user.display_name} <span style={{color: "grey", fontSize: "14px" }}>({user.username})</span></>
            : user.username }</span>
          <span style={{ color: "gray", fontSize: "14px" }}>Following</span>
        </div>
      </div>
      <Link to={`/${user.username}`}>
        <button className="following-view_button">View</button>
      </Link>
    </div>
    <div className="content-break" />
  </>
);

export default function () {
  const dispatch = useDispatch();
  const loggedIn = useSelector((store) => store.authentication.token);
  const [follows, setFollows] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/follows`, {
        headers: { Authorization: `Bearer ${loggedIn}` },
      });
      const responseData = await response.json();
      setFollows(responseData.following);
    }
    if (loggedIn) fetchData();
    setLoaded(true);
  }, [dispatch, loggedIn]);

  if (!loggedIn && loaded) {
    return <Redirect to="/" />
  }

  if (!loaded) {
    return null;
  }

  return (
    <>
    <Navbar />
    <div className="container">
      <SidebarNav />
      <div className="content">
        <h3 className="content-header">Following</h3>
        <div className="content-break" />
        <div className={loaded ? "slide-in" : "slide-in hidden"}>
          {follows.map(user => <FollowCard key={user.id} user={user} />)}
        </div>
      </div>
    </div>
    </>
  )
}
