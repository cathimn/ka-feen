import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";

import { apiUrl } from "../config";
import { AppContext } from "../AppContext";

import Navbar from "./Navbar";
import SidebarNav from "./SidebarNav";
import Post from './Post';

export default function () {
  const { currentUser } = useContext(AppContext);
  const [feed, setFeed] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedPage, setFeedPage] = useState(1);
  const [end, setEnd] = useState(false);
  const [newPost, setNewPost] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/users/feed`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const responseData = await response.json();
      setEnd(responseData.end_of_feed);
      setFeed(responseData.feed);
      setLoaded(true);
    }
    if (currentUser.token) fetchData();
    setNewPost(false);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentUser.token, newPost])

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    const loadMore = document.getElementById("load-more");
    if (loadMore) loadMore.click()
  }

  const addToFeed = async () => {
    setLoading(true);
    const response = await fetch(`${apiUrl}/users/feed/page=${feedPage}`, {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    });
    const data = await response.json();
    const newFeed = data.feed;
    setFeed([...feed, ...newFeed]);
    setEnd(data.end_of_feed);
    setFeedPage(feedPage + 1);
    setLoading(false);
  }

  if (!currentUser.token) {
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
        : feed.map(post => <Post key={post.id} post={post} setNewPost={setNewPost}/>)}
        {end ? null
          : loaded && <button id="load-more" onClick={() => addToFeed()}>
            {loading ? "Loading..." : ""}
          </button>}
        </div>
      </div>
    </div>
    </>
  );
}
