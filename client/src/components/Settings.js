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
    }
    
    if (loggedIn) {
      fetchData();
    }
    
    setLoaded(true);
  }, [dispatch, loggedIn])

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
              ></input>
            </div>
            <div>
              <label htmlFor="username">Username</label> <br />
              <input
                type="text"
                name="username"
              ></input>
            </div>
            <div>
              <label htmlFor="bio">About You</label> <br />
              <textarea
                name="bio"
              ></textarea>
            </div>
            <div>
              <label htmlFor="payments">Accept "Payments"</label> <br />
              <input type="checkbox"/>
            </div>
            <div style={{ height: "150px" }}>
              <label htmlFor="tags">What do you do?</label><br />
              <ul className="settings-tags">
                {userData.tags ? userData.tags.map(tag =>
                  <li key={tag.id}>
                    {tag.tag_name}
                    <i className="fa fa-close" />
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
