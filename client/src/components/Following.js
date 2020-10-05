import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { AppContext } from '../AppContext';
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
            backgroundImage: `url(${user.avatar_url})` }}
        />
        <div
          style={{
            position: "relative",
            left: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span>
            {user.display_name
            ?
            <>
            {user.display_name}&nbsp;
            <span style={{color: "grey", fontSize: "14px" }}>({user.username})</span>
            </>
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
  const { currentUser } = useContext(AppContext);
  const [follows, setFollows] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/follows`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const responseData = await response.json();
      setFollows(responseData.following);
    }
    fetchData();
    setLoaded(true);
  }, [currentUser.token]);

  if (!currentUser.token && loaded) {
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
        {follows.length === 0
        ? <p style={{
            alignSelf: "center",
            padding: "50px",
            textAlign: "center",
            color: "gray" }}>
            You haven't followed anyone yet, so let's&nbsp;
            <Link to="/explore"
              style={{
                color: "darkslateblue",
                textDecoration: "solid underline darkslateblue"}}>explore</Link>!</p>
        : follows.map(user => <FollowCard key={user.id} user={user} />)}
      </div>
    </div>
    </>
  )
}
