import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";

import { AppContext } from "../AppContext";
import { signup } from "../actions/authentication";

export default function () {
  const { signupModalDisplay, setSignupModalDisplay, setLoginModalDisplay } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(username, email, password));
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
