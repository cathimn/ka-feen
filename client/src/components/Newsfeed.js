import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";

import { apiUrl } from "../config";
import { AppContext } from "../AppContext";

import Navbar from "./Navbar";
import SidebarNav from "./SidebarNav";
import Post from './Post';

const MyInfo = () => {
  const { myInfoDisplay, setMyInfoDisplay } = useContext(AppContext);

  return (
  <div id="my-info" className={myInfoDisplay ? "" : "hidden"}>
    <button onClick={e => setMyInfoDisplay(false)}><i className="fa fa-close"/></button>
    Welcome to Ka-feen!<br/><br/>
    This portfolio project is based on <a href="https://ko-fi.com/">Ko-fi</a> and made by&nbsp;
    <a href="https://cathimn.github.io/">Cath Lee</a> using React, Flask, and SQLAlchemy.<br/><br/>
    Check out the <a href="https://github.com/cathimn/ka-feen">GitHub repo</a>&nbsp;
    or my <a href="https://www.linkedin.com/in/cath-lee">LinkedIn</a> for more information about me and my projects. <i className="fa fa-smile-o"/>
  </div>
  )
};

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
      <div style={{ width: "500px", position: "relative" }}>
        <div className="content-break" />
        <MyInfo />
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
