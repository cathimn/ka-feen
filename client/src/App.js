import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { AppContext } from './AppContext';

import LandingPage from './components/LandingPage';
import Newsfeed from './components/Newsfeed';

import { loadToken } from './actions/authentication';

import Login from './components/Login';
import Signup from './components/Signup';
import Following from './components/Following';
import Explore from './components/Explore';
import Settings from './components/Settings';

function App() {
  const dispatch = useDispatch();

  const [loginModalDisplay, setLoginModalDisplay] = useState(false);
  const [signupModalDisplay, setSignupModalDisplay] = useState(false);

  const closeAllModals = () => {
    setLoginModalDisplay(false);
    setSignupModalDisplay(false);
  }

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch])

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllModals();
    });
  }, []);

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
          <Route path="/">
            <LandingPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
