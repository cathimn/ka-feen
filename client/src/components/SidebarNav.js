import React from "react";
import { useDispatch } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import { logout } from "../actions/authentication";

export default function () {
  const dispatch = useDispatch();

  return (
    <div className="sidebar-container">
      <ul>
        <Link to="/newsfeed">
          <span>
            <i className="fa fa-home" />
          </span>
          <span>Home</span>
        </Link>
        <Link>
          <span>
            <i className="fa fa-user-circle" />
          </span>
          <span>Your Page</span>
        </Link>
        <Link>
          <span>
            <i className="fa fa-cog" />
          </span>
          <span>Settings</span>
        </Link>
        <Link>
          <span>
            <i className="fa fa-search" />
          </span>
          <span>Explore</span>
        </Link>
        <Link>
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
        <li onClick={() => dispatch(logout())}>
          <span>
            <i className="fa fa-sign-out" />
          </span>
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
}
