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
  const [validUser, setValidUser] = useState();
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
      } else {
        setValidUser(false);
      }
      setLoaded(true)
    }
    fetchUserPageInfo();
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

  if (loaded && user === loggedInUser.username) {
    return <EditUserPage />
  }

  if (loaded && !validUser) {
    return <Error />
  }

  console.log(`loaded? ${loaded}, loggedIn? ${loggedInUser.username}, validUser? ${validUser}`)

  return (
    <>
      <Navbar />
      <div
        style={
          userPageInfo.banner_url
            ? {
                backgroundPosition: "center",
                backgroundSize: "cover",
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
              style={{
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundImage: `url(${userPageInfo.avatar_url})` }}
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
          <div className="userpage-right">
            <div className="userpage-support">
              <h3>
                Buy some caffeine for{" "}
                {userPageInfo.display_name || userPageInfo.username}
              </h3>
              <div>
                <i className="fa fa-coffee" /> $3 each
              </div>
              <form>
                <input type="number" defaultValue="1"></input>
              </form>
            </div>
            <div className="userpage-posts">
              <h3>Feed</h3>
              {userPageInfo.userpage_feed.map(post => {
                if (post.amount) {
                  return <div className="userpage-post">{post.author} bought some caffeine for {userPageInfo.display_name || userPageInfo.username}<p>{post.body}</p></div>
                } else {
                  return <div className="userpage-post">{post.author} posted <p>{post.body}</p></div>
                }}
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
