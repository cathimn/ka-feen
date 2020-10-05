import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AppContext } from '../AppContext';

import Navbar from './Navbar';

export default function () {
  const { setSignupModalDisplay, currentUser } = useContext(AppContext);

  if (currentUser.token) {
    return <Redirect to='/newsfeed' />
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <img src="https://kafeen.s3.us-east-2.amazonaws.com/IMG_0852.PNG" width="1000px" alt="cartoon caffeinated drinks"/>
        <div style={{position: "absolute", top: "175px", textAlign: "center"}}>
          <h1 style={{ fontSize: "50px"}}>Fund Your Passions</h1>
          <p style={{ width: "450px" }}>The friendly and free way for fans to support your work for the price of your favorite caffeinated beverage.</p>
          <button
            id="get-started"
            onClick={() => setSignupModalDisplay(true)}>
            Get started for free!</button>
        </div>
      </div>
    </>
  );
}
