import React, { useState, useContext } from "react";
import { useDispatch } from 'react-redux';

import { AppContext } from '../AppContext';
import { login } from '../actions/authentication';

export default function () {
  const { loginModalDisplay, setLoginModalDisplay, setSignupModalDisplay } = useContext(AppContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
    // if no errors
    setPassword('');
    setEmail('');
    setLoginModalDisplay(false);
  }

  const closeModal = (e) => {
    if (e.target.id === 'login_modal') setLoginModalDisplay(false);
  }

  return (
    <div
      id="login_modal"
      onClick={closeModal}
      className={
        loginModalDisplay ? "modal-container" : "modal-container hidden"
      }
    >
      <div className="modal-display">
        <button
          className="modal-close"
          onClick={(e) => setLoginModalDisplay(false)}
        >
          <i className="fa fa-close" aria-hidden="true" />
        </button>
        <h3>Log in</h3>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Log in</button>
        </form>
        <button className="modal-link">
          Log in with a demo account.
        </button>
        <br/>
        <button
          className="modal-link"
          onClick={() => {
            setLoginModalDisplay(false);
            setSignupModalDisplay(true);
          }}
        >
          New to Ka-feen? Sign up here!
        </button>
      </div>
    </div>
  );
}
