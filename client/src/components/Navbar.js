import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppContext } from '../AppContext';

import SidebarNav from './SidebarNav';

function Navbar () {
  const loggedIn = useSelector((store) => store.authentication.token);
  const loggedInUser = useSelector((store) => store.authentication.user);
  const { setLoginModalDisplay, setSignupModalDisplay } = useContext(AppContext);

  const [showSidebar, setShowSidebar] = useState();

  return (
    <>
    <div className={showSidebar ? "sidebar-collapse" : "sidebar-collapse hidden"}>
      <SidebarNav />
    </div>
    <div className="navbar">
      <div id="navbar_logo">
        <span>
          <i className="fa fa-coffee" />
        </span>
        <span>&nbsp; Ka-feen</span>
      </div>
      <ul style={{ display: "flex" }}>
        {loggedIn ? (
          <> 
            <Link to={`/${loggedInUser.username}`}>
              <li><div style={{ backgroundImage: `` }}></div>Your Page</li>
            </Link>
            <Link to="/newsfeed">
              <li>
                <i className="fa fa-home" />
              </li>
            </Link>
            <li onClick={() => setShowSidebar(!showSidebar)}>
              <i className="fa fa-bars" />
            </li>
          </>
        ) : (
          <>
            <Link to="/explore">Explore</Link>
            <li onClick={() => setLoginModalDisplay(true)}>Log in</li>
            <li
              className="navbar-button" 
              onClick={() => setSignupModalDisplay(true)}>Start a page</li>
          </>
        )}
      </ul>
    </div>
    </>
  );
}

export default Navbar;
