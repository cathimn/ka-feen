import React, { useState, useContext } from "react";

import { AppContext } from "../AppContext";
import { signup } from "../actions/authentication";
import { apiUrl, TOKEN_KEY, USER_KEY } from "../config";

export default function () {
  const { signupModalDisplay, setSignupModalDisplay, setLoginModalDisplay, setCurrentUser } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors("Passwords do not match.");
      return;
    }

    const response = await fetch(`${apiUrl}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })

    if (response.ok) {
      const { token, id, username, display_name } = await response.json();
      window.localStorage.setItem(TOKEN_KEY, token);
      const user = { id: id, username: username, displayName: display_name };
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      setCurrentUser({token, ...user})
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }

    setSignupModalDisplay(false);
  };

  const closeModal = (e) => {
    if (e.target.id === "signup_modal") setSignupModalDisplay(false);
  };

  return (
    <div
      id="signup_modal"
      onClick={closeModal}
      className={
        signupModalDisplay ? "modal-container" : "modal-container hidden"
      }
    >
      <div className="modal-display">
        <button
          className="modal-close"
          onClick={(e) => setSignupModalDisplay(false)}
        >
          <i className="fa fa-close" aria-hidden="true" />
        </button>
        <h3>Join Ka-feen! It's free.</h3>
        {errors}
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
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
          <input
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <button type="submit">Create Account</button>
        </form>
        <button
          className="modal-link"
          onClick={() => {
            setSignupModalDisplay(false);
            setLoginModalDisplay(true);
          }}
        >
          Already have an account? Log in here.
        </button>
      </div>
    </div>
  );
}
