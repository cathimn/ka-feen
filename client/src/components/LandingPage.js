import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { AppContext } from '../AppContext';

import Navbar from './Navbar';

export default function () {
  const loggedIn = useSelector((store) => store.authentication.token);
  const { setSignupModalDisplay } = useContext(AppContext);

  if (loggedIn) {
    return <Redirect to='/newsfeed' />
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <img src="https://kafeen.s3.us-east-2.amazonaws.com/IMG_0852.PNG" width="1000px"/>
        <div style={{position: "absolute", top: "175px", textAlign: "center"}}>
          <h1 style={{ fontSize: "50px"}}>Fund Your Passions</h1>
          <p style={{ width: "450px" }}>The friendly and free way for fans to support your work for the price of your favorite caffeinated beverage.</p>
          <button
            onClick={() => setSignupModalDisplay(true)}
            style={{
              fontWeight: "600",
              borderRadius: "50px",
              fontSize: "20px",
              padding: "10px 20px",
              backgroundColor: "slateblue",
              marginTop: "10px",
              color: "white"}}>Get started for free!</button>
        </div>
      </div>
    </>
  );
}
