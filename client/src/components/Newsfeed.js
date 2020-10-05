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
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedPage, setFeedPage] = useState(1);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/users/feed`, {
        headers: { Authorization: `Bearer ${loggedIn}` },
      });
      const responseData = await response.json();
      setEnd(responseData.end_of_feed);
      setFeed(responseData.feed);
      setLoaded(true);
    }
    if (loggedIn) fetchData();
  }, [loggedIn])

  const addToFeed = async () => {
    setLoading(true);
    const response = await fetch(`${apiUrl}/users/feed/page=${feedPage}`, {
      headers: { Authorization: `Bearer ${loggedIn}` },
    });
    const data = await response.json();
    const newFeed = data.feed;
    setFeed([...feed, ...newFeed]);
    setEnd(data.end_of_feed);
    setFeedPage(feedPage + 1);
    setLoading(false);
  }

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
      <div style={{ width: "500px" }}>
        <div className="content-break" />
        {loaded && feed.length === 0
        ? <div style={{ marginTop: "15px" }}>Nothing to see here.</div>
        : feed.map(post => <Post key={post.id} post={post} />)}
        {end ? null
          : loaded && <button id="load-more" onClick={() => addToFeed()}>
            {loading ? "Loading..." : "Load more..."}
          </button>}
        </div>
      </div>
    </div>
    </>
  );
}
