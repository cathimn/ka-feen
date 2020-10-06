import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { AppContext } from '../AppContext';
import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

const FollowCard = ({ user }) => (
  <>
    <div className="follow-card">
      <div className="follow-card__left">
        <img
          alt="avatar"
          className="post-avatar"
          src={user.avatar_url}
          onError={(e) => e.target.src = "https://kafeen.s3.us-east-2.amazonaws.com/Screen+Shot+2020-09-20+at+11.52.11+PM.png"} />
        <div className="follow-card__left-info">
          <span style={{ fontWeight: "600" }}>{user.display_name || user.username}</span>
          <span style={{ color: "grey", fontSize: "14px" }}>ka-feen.herokuapp.com/{user.username}</span>
        </div>
      </div>
      <Link to={`/${user.username}`} className="following-view_button">
        View
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
