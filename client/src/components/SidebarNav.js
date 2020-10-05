import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AppContext } from "../AppContext";
import { apiUrl, TOKEN_KEY, USER_KEY } from "../config";

export default function () {
  const { currentUser, setCurrentUser } = useContext(AppContext);

  const logout = async e => {
    const response = await fetch(`${apiUrl}/session/logout`, {
      method: "delete",
      headers: { Authorization: `Bearer ${currentUser.token}` },
    });

    if (response.ok) {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
      setCurrentUser({token: null, id: null, username: null, displayName: null})
    }
  }

  if (!currentUser.token) {
    return null;
  }

  return (
    <div id="sidebar" className="sidebar-container">
      <ul>
        <Link to="/newsfeed">
            <span>
              <i className="fa fa-home" />
            </span>
            <span>Home</span>
        </Link>
        <Link to={`/${currentUser.username}`}>
          <span>
            <i className="fa fa-user-circle" />
          </span>
          <span>Your Page</span>
        </Link>
        <Link to="/settings">
          <span>
            <i className="fa fa-cog" />
          </span>
          <span>Settings</span>
        </Link>
        <Link to="/explore">
          <span>
            <i className="fa fa-search" />
          </span>
          <span>Explore</span>
        </Link>
        <Link to="/support">
          <span>
            <i className="fa fa-list" />
          </span>
          <span>Received & Given</span>
        </Link>
        <Link to="/following">
            <span>
              <i className="fa fa-users" />
            </span>
            <span>Following</span>
        </Link>
        <li onClick={logout}>
          <span>
            <i className="fa fa-sign-out" />
          </span>
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
}
