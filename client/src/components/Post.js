import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../AppContext';

import { apiUrl } from '../config';

export default function ({ post, setNewPost }) {
  const { currentUser } = useContext(AppContext);
  const [likes, setLike] = useState(post.likers ? [...post.likers] : null);
  const [showDelete, setShowDelete] = useState();

  const deletePost = async (e, post) => {
    e.preventDefault();
    const response = await fetch(`${apiUrl}/posts`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "post_id": post })
    })
    if (response.ok) {
      setNewPost(true);
    }
  }

  const handleLikeClick = async (e, post) => {
    e.preventDefault();
    if (likes.includes(currentUser.id)) {
      const response = await fetch(`${apiUrl}/posts/like`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.token}`,
         "Content-Type": "application/json" },
        body: JSON.stringify({"post_id": post})
      })
      const res = await response.json();
      setLike([...res.likers])
    } else {
      const response = await fetch(`${apiUrl}/posts/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "post_id": post })
      })
      const res = await response.json();
      setLike([...res.likers])
    }
  }

  return (
    <div className="post-container">
      <div className="post-header">
        <Link to={post.private_supporter ? "#" : `/${post.username}`}>
          <img
            alt="avatar"
            className="post-avatar"
            src={post.author_avatar}
            onError={(e) => e.target.src = "https://kafeen.s3.us-east-2.amazonaws.com/Screen+Shot+2020-09-20+at+11.52.11+PM.png"} />
        </Link>
        <div className="post-info">
          <div>
            <strong>
              {post.private_supporter
              ? post.private_supporter
              : ( post.username === currentUser.username )
                ? "You"
                : post.supporter || post.author}</strong>
            {post.supported
            ? <span>&nbsp;bought some caffeine for&nbsp;
              <strong>{post.supported}</strong></span>
            : <span>&nbsp;posted</span>}</div>
          <div style={{ fontSize: "14px", color: "gray" }}>{post.posted_on}</div>
        </div>
      </div>
      {post.body || post.image_url
      ?
      <>
      <div className="post-arrow"></div>
      <div className="post-body">
        {post.image_url &&
          <img
            className="post-body__image"
            alt="post"
            src={post.image_url} />}
        <p className="post-body__text">{post.body}</p>
        {likes &&
        <div className="post-buttons">
          <div style={{ display: "flex" }}>
            <button
              onClick={e => handleLikeClick(e, post.id, likes)}
              className={likes.includes(currentUser.id) ? "like-button liked" : "like-button"} >
              <i className="fa fa-heart" />
            </button>
            <span>&nbsp;{likes.length > 0 ? likes.length : null}</span>
          </div>
          <div>
            {showDelete &&
            <button className="delete-button" onClick={e => deletePost(e, post.id)}>Delete</button>}
            {currentUser.username === post.username
            && !post.supported
            && <button onClick={e => setShowDelete(!showDelete)}><i className="fa fa-ellipsis-h" style={{ color: "lightgray" }} /></button>}
          </div>

          </div>}
      </div>
      </>
      : null}
    </div>

  )
}
