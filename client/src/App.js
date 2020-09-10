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
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    })
  }, [dispatch])

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
          <Route path="/following">
            <Following />
          </Route>
          <Route path="/newsfeed">
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
