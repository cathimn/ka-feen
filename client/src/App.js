import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Newsfeed from './components/Newsfeed';

import { loadToken, logout } from './actions/authentication';


function App() {
    const dispatch = useDispatch();
    const loggedIn = useSelector(store => store.authentication.token);

    useEffect(() => {
        dispatch(loadToken());
    }, [])

    return (
      <BrowserRouter>
        <NavLink to="/">HOME</NavLink>
        {loggedIn ? <button onClick={() => dispatch(logout())}>LOG OUT</button> : <NavLink to="/login">LOG IN</NavLink>}
        <Switch>
          <Route path="/newsfeed">
            <Newsfeed />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/">
            <LandingPage />
          </Route>
        </Switch>
      </BrowserRouter>
    );
}

export default App;
