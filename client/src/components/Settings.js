import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';
import { Redirect } from 'react-router-dom';

export default function () {
  const dispatch = useDispatch();
  const loggedIn = useSelector((store) => store.authentication.token);
  const [loaded, setLoaded] = useState(false);
  const [tags, setTags] = useState([]);
  const [userData, setUserData] = useState({});
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [userTags, setUserTags] = useState([]);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/users/tags`);
      const responseData = await response.json();
      setTags(responseData.tags);
      
      const requestUserInfo = await fetch(`${apiUrl}/users/settings`, {
        headers: { Authorization: `Bearer ${loggedIn}` },
      });
      const userInfoData = await requestUserInfo.json();
      setUserData(userInfoData);
      setUserTags(userInfoData.tags);
      setPayment(userInfoData.accept_payments);
    }
    
    if (loggedIn) {
      fetchData();
    }
    
    setLoaded(true);
  }, [dispatch, loggedIn])

  const removeTag = e => {
    e.preventDefault();
    console.log(e.target.id)
  }

  if (!loggedIn && loaded) {
    return <Redirect to="/" />
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <SidebarNav />
        <div className="content" style={{ width: "750px" }}>
          <h3 className="content-header">Settings</h3>
          <div className="content-break" />
          <form className="settings-form" name="settings">
            <div>
              <label htmlFor="displayName">Display Name</label> <br />
              <input
                type="text"
                name="displayName"
                placeholder={userData.display_name}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                ></input>
            </div>
            <div>
              <label htmlFor="username">Username</label> <br />
              <input
                type="text"
                name="username"
                placeholder={userData.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ></input>
            </div>
            <div>
              <label htmlFor="bio">About You</label> <br />
              <textarea
                name="bio"
                rows="5"
                placeholder={userData.bio}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label>Accept "Payments"</label> <br />
              <div htmlFor="payments" className="slider">
              {payment ? "accepts" : "deneis"}
              </div>
            </div>
            <div style={{ height: "150px" }}>
              <label htmlFor="tags">What do you do?</label><br />
              <ul className="settings-tags">
                {userData.tags ? userData.tags.map(tag =>
                  <li key={tag.id}>
                    <span>{tag.tag_name}</span>
                    <button onClick={removeTag}><i className="fa fa-close" /></button>
                  </li>) : null}
                <input type="text"></input>
              </ul>
            </div>
            <button htmlFor="settings" type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </>
  );
}
