import React, { useState, useContext } from "react";

import { AppContext } from '../AppContext';
import { apiUrl, TOKEN_KEY, USER_KEY } from "../config";

function Login () {
  const { loginModalDisplay, setLoginModalDisplay, setSignupModalDisplay, setCurrentUser } = useContext(AppContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${apiUrl}/session`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token, id, username, displayName } = await response.json();
      window.localStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem(USER_KEY, JSON.stringify({
        id, username, displayName
      }));
      setCurrentUser({ token, id, username, displayName });
      setPassword('');
      setEmail('');
      setLoginModalDisplay(false);
      setErrors('');
    } else {
      const err = await response.json();
      setErrors(err.msg);
    }
  }

  const closeModal = (e) => {
    if (e.target.id === 'login_modal') setLoginModalDisplay(false);
  }

  const demoLogin = (e) => {
    e.preventDefault();
    setEmail("captain@thecat.com");
    setPassword("astinkycheese");
    setTimeout(() => {
      document.getElementById("login-button").click();
    }, 0)
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
        {errors}
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button id="login-button" type="submit">Log in</button>
        </form>
        <button onClick={demoLogin} className="modal-link">
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

export default Login;
