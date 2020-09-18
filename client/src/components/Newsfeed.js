import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { apiUrl } from "../config";

import Navbar from "./Navbar";
import SidebarNav from "./SidebarNav";
import Post from './Post';

export default function () {
  const loggedIn = useSelector((store) => store.authentication.token);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/users/feed`, {
        headers: { Authorization: `Bearer ${loggedIn}` },
      });
      const responseData = await response.json();
      setFeed(responseData.feed);
    }
    fetchData();
  }, [loggedIn])

  if (!loggedIn) {
    return <Redirect to="/" />
  }
  return (
    <>
    <Navbar />
    <div className="container">
      <SidebarNav />
      <div className="content">
        <h3 className="content-header">Newsfeed</h3>
        <div className="content-break"></div>
        <div style={{ width: "550px"}}>
        {feed.map(post => <Post key={post.id} post={post} />)}
        </div>
      </div>
    </div>
    </>
  );
}
