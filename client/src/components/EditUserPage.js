import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { apiUrl } from '../config';

import Navbar from './Navbar';
import Post from './Post';

export default function () {
  const { user } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [userPageInfo, setUserPageInfo] = useState({});

  useEffect(() => {
    async function fetchUserPageInfo() {
      const response = await fetch(`${apiUrl}/users/${user}`);
      if (response.ok) {
        const data = await response.json();
        setUserPageInfo({ ...data });
      }
      setLoaded(true);
    }

    fetchUserPageInfo();
  }, [])

  if (!loaded) {
    return null;
  }
  
  return (
    <>
      <Navbar />
      <div style={{
        backgroundColor: "whitesmoke",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundImage: `url(${userPageInfo.banner_url})`,
        height: "250px",}}>
          <button style={{fontSize: "80px"}}>EDIT</button>
      </div>
      <div className="userpage-container"
        style={{ marginTop: "25px"}}>
        <div className="userpage-topbar">
          <div className="userpage-avatarinfo">
            <div className="userpage-avatar" />
            <div className="userpage-info">
              <h1>{userPageInfo.display_name || userPageInfo.username}</h1>
              <div style={{ color: "slategray" }}>
                ka-feen.herokuapp.com/{userPageInfo.username}
              </div>
            </div>
          </div>
          <div className="userpage-button">
            <button>EDIT</button>
            <button>SETTINGS</button>
          </div>
        </div>
        <div className="userpage-main">
          <div className="userpage-left">
            <h3>About</h3>
            <p style={{ margin: "5px 0" }}>{userPageInfo.bio}</p>
            <div className="userpage-tag_container">
              {userPageInfo.tags
                ?
                userPageInfo.tags.map(el =>
                  <span key={el.id} className="userpage-tag">
                    {el.tag_name}</span>)
                : null}
            </div>
            <div style={{ fontSize: "18px" }}>
              {userPageInfo.total_support > 0
                ? <div><i className="fa fa-coffee" />&nbsp;x&nbsp;
              <strong>{userPageInfo.total_support}</strong>
              &nbsp;Received</div> : null}
            </div>
          </div>
          <div className="userpage-right">
            <div className="userpage-create_post">
              <textarea placeholder="Write a quick update..."></textarea>
              <input
                style={{ position: "absolute"}}
                name="image" type="file" accept=".png,.jpg,.jpeg,.gif"></input>
              <button htmlFor="image" style={{
                margin: "5px 0",
                backgroundColor: "whitesmoke",
                fontWeight: "600",
                fontSize: "14px",
                padding: "5px 10px",
                borderRadius: "5px"
              }}>
                <i className="fa fa-image" /> Add Image
              </button>
              <button style={{
                margin: "5px 0",
                backgroundColor: "slateblue",
                color: "white",
                fontWeight: "600",
                fontSize: "18px",
                padding: "5px 10px",
                borderRadius: "5px"}}>Post</button>
            </div>
            <div className="userpage-posts">
              <h3>Feed</h3>
              {userPageInfo.userpage_feed ? userPageInfo.userpage_feed.map(post => {
                if (post.amount) {
                  return (
                    <Post key={"support" + post.id} post={post} support={userPageInfo.display_name || userPageInfo.username} />)
                } else {
                  return (
                    <Post key={"post" + post.id} post={post} />
                  )
                }
              }
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
