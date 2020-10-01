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
  const [processingPost, setProcessingPost] = useState(null);
  const [postBody, setPostBody] = useState("");
  const [image, setImage] = useState({ preview: "", raw: ""});
  const [error, setError] = useState("");
  const [newPost, setNewPost] = useState(null);

  const [processingImage, setProcessingImage] = useState(null);
  const [avatar, setAvatar] = useState({ preview: "", raw: "" })
  const [banner, setBanner] = useState({ preview: "", raw: "" })

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
    setProcessingPost(true);

    if (postBody.length === 0 && image.preview === "") {
      setError("Your post needs some content.")
      setProcessingPost(false);
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

    setProcessingPost(false);
  }

  const handleAvatarChange = (e) => {
    setAvatar({ preview: URL.createObjectURL(e.target.files[0]), raw: e.target.files[0] })
  }

  const handleBannerChange = (e) => {
    setBanner({ preview: URL.createObjectURL(e.target.files[0]), raw: e.target.files[0] })
  }

  const submitChanges = async (e) => {
    e.preventDefault();
    setProcessingImage(true);
    let formData = new FormData();
    formData.append("banner", banner.raw)
    formData.append("avatar", avatar.raw)
    const response = await fetch(`${apiUrl}/users/update/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${loggedIn}` },
      body: formData
    })

    if (response.ok) {
      setProcessingImage(false);
      setBanner({ preview: "", raw: "" });
      setAvatar({ preview: "", raw: "" });
      setNewPost(true);
    }
  }

  const addToFeed = async () => {
    setLoading(true);
    const response = await fetch(`${apiUrl}/users/${loggedInUser.username}/page=${feedPage}`);
    const data = await response.json();
    const feed = data.userpage_feed;
    const current = userPageInfo.userpage_feed;
    setUserPageInfo({
      ...userPageInfo,
      "end_of_feed": data.end_of_feed,
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
      <Navbar/>
      {userPageInfo.banner_url || banner.preview ? 
        <div
          id="banner"
          className="userpage-banner"
          style={
            banner.preview
            ? { backgroundImage: `url(${banner.preview})` }
            : { backgroundImage: `url(${userPageInfo.banner_url})`}} />
      : null}
      <input
        onChange={handleBannerChange}
        className="hidden"
        id="banner-upload"
        type="file"
        accept=".png,.jpg,.jpeg,.gif" />
      <div className="userpage-container"
        style={ userPageInfo.banner_url || banner.preview ? { marginTop: "25px"} : {marginTop: "100px"}}>
        <div className="userpage-topbar">
          <div className="userpage-avatarinfo">
            <div className="userpage-avatar"
              style={avatar.preview ? { backgroundImage: `url(${avatar.preview})`} : {backgroundImage: `url(${userPageInfo.avatar_url})`}}>
              <label htmlFor="avatar-upload" id="edit-button">
                <i className="fa fa-pencil" />
              </label>
              <input
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
                type="file"
                accept=".png,.jpg,.jpeg,.gif"></input>
            </div>
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
            {banner.preview || avatar.preview ?
              <button id="banneravatar-submit" onClick={submitChanges}>
                {processingImage ? "Processing..." : "Submit changes"}
              </button> : null}
            <label htmlFor="banner-upload" id="banner-edit">
              <i className="fa fa-picture-o" />&nbsp;Change cover
            </label>
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
            {userPageInfo.tags.length > 0
              ?
              <div className="userpage-tag_container">
              {userPageInfo.tags.map(el =>
                <span key={el.id} className="userpage-tag">
                  {el.tag_name}</span>
              )}
              </div>
              : null}
            {userPageInfo.total_support > 0
              ? <div style={{ fontSize: "18px" }}><i className="fa fa-coffee" />&nbsp;x&nbsp;
            <strong>{userPageInfo.total_support}</strong>
            &nbsp;Received</div> : null}
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
                disabled={processingPost}
                onClick={handleSubmit}
                id="add-post-button">{processingPost && error === "" ? "Sending..." : "Post"}</button>
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
