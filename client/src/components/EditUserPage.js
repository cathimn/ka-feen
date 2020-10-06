import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../AppContext';
import { apiUrl } from '../config';

import Navbar from './Navbar';
import Post from './Post';

export default function () {
  const { currentUser } = useContext(AppContext);
  const feedRef = useRef(null);
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
      const response = await fetch(`${apiUrl}/users/${currentUser.username}`);
      if (response.ok) {
        const data = await response.json();
        setUserPageInfo({ ...data });
      }
      setLoaded(true);
    }

    fetchUserPageInfo();
    setNewPost(false);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [newPost, currentUser.username])

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    const loadMore = document.getElementById("load-more");
    if (loadMore) loadMore.click()
  }

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
    formData.append("user_id", currentUser.id);
    formData.append("body", postBody ? postBody : "");
    formData.append("image", image.raw);

    const response = await fetch(`${apiUrl}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentUser.token}` },
      body: formData
    })

    if (response.ok) {
      setNewPost(true);
      setPostBody("");
      setImage({ preview: "", raw: "" });
    }

    setProcessingPost(false);
    window.scrollTo({
      left: 0,
      top: feedRef.current.offsetTop - 75,
      behavior: "smooth"
    })
  }

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar({ preview: URL.createObjectURL(e.target.files[0]), raw: e.target.files[0] })
    }
  }

  const handleBannerChange = (e) => {
    if (e.target.files[0]) {
      setBanner({ preview: URL.createObjectURL(e.target.files[0]), raw: e.target.files[0] })
    }
  }

  const submitChanges = async (e) => {
    e.preventDefault();
    setProcessingImage(true);
    let formData = new FormData();
    formData.append("banner", banner.raw)
    formData.append("avatar", avatar.raw)
    const response = await fetch(`${apiUrl}/users/update/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${currentUser.token}` },
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
    const response = await fetch(`${apiUrl}/users/${currentUser.username}/page=${feedPage}`);
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
        disabled={processingImage}
        onChange={handleBannerChange}
        className="hidden"
        id="banner-upload"
        type="file"
        accept=".png,.jpg,.jpeg,.gif" />
      <input
        disabled={processingImage}
        onChange={handleAvatarChange}
        className="hidden"
        id="avatar-upload"
        type="file"
        accept=".png,.jpg,.jpeg,.gif"></input>
      <div
        className="userpage-container"
        style={
          userPageInfo.banner_url || banner.preview
            ? { marginTop: "25px"}
            : {marginTop: "100px"}}>
        <div className="userpage-topbar">
          <div className="userpage-avatarinfo">
            <label htmlFor="avatar-upload" id="edit-button">
              <i className="fa fa-pencil" />
            </label>
            <img
              alt="avatar"
              className="userpage-avatar"
              onError={(e) => e.target.src = "https://kafeen.s3.us-east-2.amazonaws.com/Screen+Shot+2020-09-20+at+11.52.11+PM.png"}
              src={avatar.preview || userPageInfo.avatar_url} />
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
              ? <div style={{ fontSize: "18px", marginTop: "10px" }}><i className="fa fa-coffee" />&nbsp;x&nbsp;
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
              <img src={image.preview} alt="upload preview" style={{ width: "min-content", maxWidth: "100%", marginBottom: "10px" }}/>
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
            <div ref={feedRef} className="userpage-posts">
              <h3>Feed</h3>
              {userPageInfo.userpage_feed.map(post => {
                if (post.amount) {
                  return <Post key={"support" + post.id} post={post} support={userPageInfo.display_name || userPageInfo.username}/>
                } else {
                  return <Post key={"post" + post.id} post={post} setNewPost={setNewPost} />
                }
              })}
              {!userPageInfo.end_of_feed &&
              <button id="load-more" onClick={() => addToFeed()}>
                {loading ? "Loading..." : ""}
              </button>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
