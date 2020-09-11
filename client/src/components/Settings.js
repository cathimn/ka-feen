import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';
import { Redirect } from 'react-router-dom';
import { loadToken } from '../actions/authentication';

export default function () {
  const dispatch = useDispatch();
  const loggedIn = useSelector((store) => store.authentication.token);
  const [loaded, setLoaded] = useState(false);
  const [tags, setTags] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    dispatch(loadToken())

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
    
    setLoaded(true)
  }, [dispatch, loggedIn])

  if (!loggedIn && loaded) {
    return <Redirect to="/" />
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <SidebarNav />
        <div className="content">
          <h3 className="content-header">Settings</h3>
          <div className="content-break" />
          <form>
            <div>
              <label htmlFor="displayName">Display Name</label> <br />
              <input
                type="text"
                name="displayName"
                placeholder={userData.display_name}
              ></input>
            </div>
            <div>
              <label htmlFor="username">Username</label> <br />
              <input
                type="text"
                name="username"
                placeholder={userData.username}
              ></input>
            </div>
            <div>
              <label htmlFor="bio">About You</label> <br />
              <textarea
                name="bio"
                placeholder={userData.bio}
              ></textarea>
            </div>
            <div>
              <label htmlFor="payments">Accept "Payments"</label>
              <input type="checkbox"/>
            </div>
            <div>
              <button type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
