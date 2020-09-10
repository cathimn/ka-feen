import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { AppContext } from '../AppContext';

function Navbar () {
  const loggedIn = useSelector((store) => store.authentication.token);
  const { setLoginModalDisplay, setSignupModalDisplay } = useContext(AppContext);

  return (
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
            <li>Your Page</li>
            <li>
              <i className="fa fa-home" />
            </li>
            <li>
              <i className="fa fa-bars" />
            </li>
          </>
        ) : (
          <>
            <li>Explore</li>
            <li onClick={() => setLoginModalDisplay(true)}>Log in</li>
            <li onClick={() => setSignupModalDisplay(true)}>Start a page</li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
