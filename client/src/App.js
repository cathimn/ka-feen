import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { AppContext } from './AppContext';

import LandingPage from './components/LandingPage';
import Newsfeed from './components/Newsfeed';
import Login from './components/Login';
import Signup from './components/Signup';
import Following from './components/Following';
import Explore from './components/Explore';
import Settings from './components/Settings';
import Error from './components/Error'
import UserPage from './components/UserPage';
import EditUserPage from './components/EditUserPage';
import SupportPage from './components/SupportPage';

import { apiUrl, TOKEN_KEY, USER_KEY } from './config';

function App() {
  const [currentUser, setCurrentUser] = useState({ token: null, id: null, username: null, displayName: null })
  const [loaded, setLoaded] = useState(false);
  const [loginModalDisplay, setLoginModalDisplay] = useState(false);
  const [signupModalDisplay, setSignupModalDisplay] = useState(false);
  const [sidebarDisplay, setSidebarDisplay] = useState(false);

  const closeAllModals = () => {
    setLoginModalDisplay(false);
    setSignupModalDisplay(false);
    setSidebarDisplay(false);
  }

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setCurrentUser({ token: null, id: null, username: null, displayName: null });
      setLoaded(true);
      return;
    }

    async function checkToken() {
      const response = await fetch(`${apiUrl}/session`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const res = await response.json();
        setCurrentUser({
          token: res.token,
          id: res.id,
          username: res.username,
          displayName: res.displayName
        })
      }
      setLoaded(true);
    }

    checkToken();
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllModals();
    });
    document.addEventListener("click", (e) => {
      if (e.target.id !== "hamburger") setSidebarDisplay(false);
    })
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginModalDisplay,
        setLoginModalDisplay,
        signupModalDisplay,
        setSignupModalDisplay,
        sidebarDisplay,
        setSidebarDisplay,
      }}
    >
      <Login />
      <Signup />
      <BrowserRouter>
        <Switch>
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route exact path="/explore">
            <Explore />
          </Route>
          <Route exact path="/following">
            <Following />
          </Route>
          <Route exact path="/newsfeed">
            <Newsfeed />
          </Route>
          <Route exact path="/support">
            <SupportPage />
          </Route>
          <Route exact path="/notfound">
            <Error />
          </Route>
          <Route exact path={`/${currentUser.username}`}>
            <EditUserPage />
          </Route>
          <Route path="/:user">
            <UserPage />
          </Route>
          <Route path="/">
            <LandingPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
