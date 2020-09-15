import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';

import { AppContext } from './AppContext';

import { loadToken } from './actions/authentication';

import LandingPage from './components/LandingPage';
import Newsfeed from './components/Newsfeed';
import Login from './components/Login';
import Signup from './components/Signup';
import Following from './components/Following';
import Explore from './components/Explore';
import Settings from './components/Settings';
import Error from './components/Error'

import { apiUrl } from './config';
import UserPage from './components/UserPage';
import SupportPage from './components/SupportPage';

function App() {
  const dispatch = useDispatch();

  const [loginModalDisplay, setLoginModalDisplay] = useState(false);
  const [signupModalDisplay, setSignupModalDisplay] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const closeAllModals = () => {
    setLoginModalDisplay(false);
    setSignupModalDisplay(false);
  }

  useEffect(() => {
    dispatch(loadToken());
    setLoaded(true);
  }, [dispatch])

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllModals();
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        loginModalDisplay,
        setLoginModalDisplay,
        signupModalDisplay,
        setSignupModalDisplay,
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
