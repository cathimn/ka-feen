import React from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

import { logout } from "../actions/authentication";

export default function () {
  const dispatch = useDispatch();

  return (
    <div className="sidebar-container">
      <ul>
        <li>
          <span>
            <i className="fa fa-home" />
          </span>
          <span>Home</span>
        </li>
        <li>
          <span>
            <i className="fa fa-user-circle" />
          </span>
          <span>Your Page</span>
        </li>
        <li>
          <span>
            <i className="fa fa-cog" />
          </span>
          <span>Settings</span>
        </li>
        <li>
          <span>
            <i className="fa fa-search" />
          </span>
          <span>Explore</span>
        </li>
        <li>
          <span>
            <i className="fa fa-list" />
          </span>
          <span>Received & Given</span>
        </li>
        <li>
          <span>
            <i className="fa fa-users" />
          </span>
          <span>Following</span>
        </li>
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
