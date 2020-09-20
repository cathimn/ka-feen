import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


import { apiUrl } from '../config';

import Navbar from './Navbar';
import Post from './Post';

export default function () {
  const loggedIn = useSelector((store) => store.authentication.token);
  const loggedInUser = useSelector((store) => store.authentication.user);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userPageInfo, setUserPageInfo] = useState({});
  const [feedPage, setFeedPage] = useState(1);
  const [processing, setProcessing] = useState(null);
  const [postBody, setPostBody] = useState("");
  const [image, setImage] = useState({ preview: "", raw: ""});
  const [error, setError] = useState("");
  const [newPost, setNewPost] = useState(null);

  useEffect(() => {
    async function fetchUserPageInfo() {
      const response = await fetch(`${apiUrl}/users/${loggedInUser.username}`);
      if (response.ok) {
        const data = await response.json();
        setUserPageInfo({ ...data });
      }
      setLoaded(true);
    }

    fetchUserPageInfo();
    setNewPost(false);
  }, [newPost, loggedInUser.username])

  const handleImageChange = (e) => {
    setImage({
      preview: URL.createObjectURL(e.target.files[0]),
      raw: e.target.files[0]
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (postBody.length === 0 && image.preview === "") {
      setError("Your post needs some content.")
      setProcessing(false);
      return
    } else {
      setError("");
    }

    let formData = new FormData();
    formData.append("user_id", loggedInUser.id);
    formData.append("body", postBody ? postBody : "");
    formData.append("image", image.raw);

    const response = await fetch(`${apiUrl}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${loggedIn}` },
      body: formData
    })

    if (response.ok) {
      setNewPost(true);
      setPostBody("");
      setImage({ preview: "", raw: "" });
    }

    setProcessing(false);
  }

  const addToFeed = async () => {
    setLoading(true);
    const response = await fetch(`${apiUrl}/users/${loggedInUser.username}/page=${feedPage}`);
    const data = await response.json();
    const end = data.end_of_feed;
    const feed = data.userpage_feed;
    const current = userPageInfo.userpage_feed;
    setUserPageInfo({
      ...userPageInfo,
      "end_of_feed": end,
      "userpage_feed": [...current, ...feed]
    })
    setFeedPage(feedPage + 1);
    setLoading(false);
  }

  if (!loaded) {
    return null;
  }
  
  return (
    <>
      <Navbar />
      <div
        id="banner"
        className="userpage-banner"
        style={{backgroundImage: `url(${userPageInfo.banner_url})`}}>
        {/* <button id="banner-edit">
          <i className="fa fa-picture-o"/>&nbsp;Change cover
        </button> */}
      </div>
      <div className="userpage-container"
        style={{ marginTop: "25px"}}>
        <div className="userpage-topbar">
          <div className="userpage-avatarinfo">
            <div className="userpage-avatar"
              style={{backgroundImage: `url(${userPageInfo.avatar_url})`}}/>
            <div className="userpage-info" style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",}}>
              <h1>{userPageInfo.display_name || userPageInfo.username}</h1>
              <div style={{ color: "slategray" }}>
                ka-feen.herokuapp.com/{userPageInfo.username}
              </div>
            </div>
          </div>
          <div className="userpage-buttons">
            <button id="edit-button">
              <i className="fa fa-pencil" />
            </button>
            <Link to="/settings">
              <button id="settings-button">
                <i className="fa fa-cog" />
              </button>
            </Link>
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
              <textarea
                required
                onChange={e => setPostBody(e.target.value)}
                value={postBody}
                placeholder="Write a quick update..."></textarea>
              {error ? <span style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{error}</span> : null }
              {image.preview
              ?
              <>
              <span style={{ color: "gray", fontSize: "12px" }}>Image preview</span><br/>
              <img src={image.preview} alt="upload preview" style={{ width: "100%", marginBottom: "10px" }}/>
              <button onClick={() => setImage({preview: "", raw: ""})} id="remove-image-button">Remove image?</button>
              </>
              : null}
              <input
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                type="file"
                accept=".png,.jpg,.jpeg,.gif"></input>
              <label
                htmlFor="image-upload"
                id="add-image">
                <i className="fa fa-image" /> Add Image
              </label>
              <button
                disabled={processing}
                onClick={handleSubmit}
                id="add-post-button">{processing && error === "" ? "Sending..." : "Post"}</button>
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
              {userPageInfo.end_of_feed ? null
                : <button id="load-more" onClick={() => addToFeed()}>
                  {loading ? "Loading..." : "Load more..."}
                </button>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
