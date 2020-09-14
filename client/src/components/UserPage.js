import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { apiUrl } from '../config';

import Navbar from './Navbar';
import EditUserPage from './EditUserPage';
import Error from './Error';

function SupportModal ({ loggedIn, user, setSupportModalDisplay }) {
  return (
    <div id="support-modal" className="modal-container">
      <div
        className="modal-display"
        style={{ width: "400px", textAlign: "left" }}
      >
        <button
          className="modal-close"
          onClick={() => setSupportModalDisplay(false)}
        >
          <i className="fa fa-close" aria-hidden="true" />
        </button>
        <h3>
          Buy some caffeine for{" "}
          {user.display_name || user.username}
        </h3>
        <div>
          <i className="fa fa-coffee" /> $3 each
        </div>
      </div>
    </div>
  );
}

export default function () {
  const { user } = useParams();
  const loggedIn = useSelector((store) => store.authentication.token);
  const loggedInUser = useSelector((store) => store.authentication.user);
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [validUser, setValidUser] = useState(false);
  const [userPageInfo, setUserPageInfo] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [editable, setEditable] = useState(false);
  const [supportModalDisplay, setSupportModalDisplay] = useState(false);

  useEffect(() => {
    async function fetchAllUsers() {
      const response = await fetch(`${apiUrl}/users`);
      const data = await response.json();
      setUsers([...data.users.map((user) => user.username)]);
    }

    fetchAllUsers();
  }, [])

  useEffect(() => {
    async function fetchUserPageInfo() {
      const response = await fetch(`${apiUrl}/users/${user}`);
      if (response.ok) {
        setValidUser(true);
        const data = await response.json();
        setUserPageInfo({ ...data });
      }
    }
    fetchUserPageInfo();
    setLoaded(true)
  }, [user, users])

  useEffect(() => {
    async function followingCheck() {
      const response = await fetch(`${apiUrl}/follows`, {
        headers: { Authorization: `Bearer ${loggedIn}` },
      });
      const data = await response.json();
      const usernames = data.following.map((user) => user.username);
      setIsFollowing(usernames.includes(user));
    }
    if (loggedIn) {
      if (user === loggedInUser.username) {
        setEditable(true);
      }
      followingCheck();
    }
  }, [loggedIn])

  if (!loaded) {
    return null;
  }

  // if (loaded && !validUser) {
  //   return <Error />
  // }

  console.log(`loaded? ${loaded}, loggedIn? ${loggedInUser.username}, validUser? ${validUser}`)

  return (
    <>
      <Navbar />
      {supportModalDisplay ? (
        <SupportModal
          loggedIn={loggedIn}
          user={userPageInfo}
          setSupportModalDisplay={setSupportModalDisplay}
        />
      ) : null}
      <div
        style={
          userPageInfo.banner_url
            ? {
                backgroundImage: `url(${userPageInfo.banner_url})`,
                height: "250px",
              }
            : { dispay: "hidden" }
        }
      />
      <div
        className="userpage-container"
        style={
          userPageInfo.banner_url
            ? { marginTop: "25px" }
            : { marginTop: "100px" }
        }
      >
        <div className="userpage-topbar">
          <div className="userpage-avatarinfo">
            <div
              className="userpage-avatar"
              style={{ backgroundImage: `url(${userPageInfo.avatar_url})` }}
            />
            <div className="userpage-info">
              <div>Buy some caffeine for</div>
              <h1>{userPageInfo.display_name || userPageInfo.username}</h1>
              <div style={{ color: "slategray" }}>
                ka-feen.herokuapp.com/{userPageInfo.username}
              </div>
            </div>
          </div>
          <div className="userpage-buttons">
            <button
              id="support-button"
              onClick={() => setSupportModalDisplay(true)}
            >
              <i className="fa fa-coffee" />
              &nbsp;Support
            </button>
            {isFollowing ? (
              <button id="following-button">
                <i className="fa fa-user" />
                <i className="fa fa-check" />
              </button>
            ) : (
              <button id="follow-button">Follow</button>
            )}
          </div>
        </div>
        <div className="userpage-main">
          <div className="userpage-left">
            <h3>
              Support {userPageInfo.display_name || userPageInfo.username}
            </h3>
            <p>{userPageInfo.bio}</p>
            {userPageInfo.tags ? userPageInfo.tags.map(el => <span>{el.tag_name}</span>) : null}
          </div>
          <div className="userpage-right">right</div>
        </div>
      </div>
    </>
  );
}
