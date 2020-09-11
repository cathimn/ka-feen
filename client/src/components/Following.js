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
          style={{ backgroundImage: `url(${user.avatarUrl})` }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span>{user.displayName || user.username}</span>
          <span style={{ color: "gray" }}>Following</span>
        </div>
      </div>
      <Link to={`/${user.username}`}>
        <button
          style={{
            marginRight: "10px",
            padding: "15px",
            borderRadius: "10px",
            color: "darkslateblue",
            backgroundColor: "lavender",
            alignSelf: "center"}}>View</button>
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
      setLoaded(true);
    }
    if (loggedIn) fetchData();
  }, [dispatch, loggedIn]);

  if (!loggedIn && loaded) {
    return <Redirect to="/" />
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
