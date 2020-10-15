import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AppContext } from '../AppContext';
import Footer from './Footer';

import Navbar from './Navbar';

export default function () {
  const { setSignupModalDisplay, currentUser } = useContext(AppContext);

  if (currentUser.token) {
    return <Redirect to='/newsfeed' />
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ flexDirection: "column" }}>
        <img src="https://kafeen.s3.us-east-2.amazonaws.com/IMG_0852.PNG" width="1000px" height="min-content" alt="cartoon caffeinated drinks"/>
        <div style={{position: "absolute", top: "175px", alignSelf: "center", textAlign: "center" }}>
          <h1 style={{ fontSize: "50px"}}>Fund Your Passions</h1>
          <p style={{ width: "450px" }}>The friendly and free way for fans to support your work for the price of your favorite caffeinated beverage. *</p>
          <button
            id="get-started"
            onClick={() => setSignupModalDisplay(true)}>
            Get started for free!</button>
        <p style={{ fontSize: "10px" }}>* This is a demo website for portfolio purposes.</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
