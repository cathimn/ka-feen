import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../AppContext';

import SidebarNav from './SidebarNav';

function Navbar () {
  const {
    currentUser,
    setLoginModalDisplay,
    setSignupModalDisplay,
    sidebarDisplay,
    setSidebarDisplay } = useContext(AppContext);

  const closeSidebar = (e) => {
    if (e.target.id === 'sidebar') setSidebarDisplay(false);
  }

  return (
    <>
    {currentUser.token &&
    <div className={sidebarDisplay ? "sidebar-collapse" : "sidebar-collapse collapsed"}>
      <SidebarNav />
    </div>}
    
    <div className="navbar" onClick={closeSidebar}>
      <div id="navbar_logo">
        <Link to="/">
          <span>
            <i className="fa fa-coffee"
              style={{
                color: "slateblue",
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: "whitesmoke",
                boxShadow: "inset 0 0 15px lavender, inset 0 0 5px lavender" }}/>
          </span>
          <span>&nbsp;Ka-feen</span>
        </Link>
      </div>
      <ul style={{ display: "flex" }}>
        {currentUser.token ? (
          <> 
            <Link to={`/${currentUser.username}`}>
              <li><div style={{ backgroundImage: `` }}></div><i className="fa fa-user"/>&nbsp;Your Page</li>
            </Link>
            <Link to="/newsfeed">
              <li>
                <i className="fa fa-home" />
              </li>
            </Link>
            <li onClick={() => setSidebarDisplay(!sidebarDisplay)}>
              <i id="hamburger" className="fa fa-bars" />
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
