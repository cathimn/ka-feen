import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function () {
  return (
    <>
      <Navbar/>
      <div className="content" style={{ margin: "150px auto", textAlign: "center" }}>
        <h1>404 - Page Not Found</h1>
        <Link to="/">
          <button style={{
            fontSize: "16px",
            fontWeight: "600",
            marginTop: "15px",
            padding: "10px 20px",
            borderRadius: "20px",
            backgroundColor: "slateblue",
            color: "white"}}>Return to Home</button>
        </Link>
      </div>
    </>
  )
}
