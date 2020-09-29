import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { apiUrl } from '../config';

export default function ({ post }) {
  const loggedIn = useSelector((store) => store.authentication.token);
  const loggedInUser = useSelector((store) => store.authentication.user);
  const [likes, setLike] = useState(post.likers ? [...post.likers] : null);

  const handleLikeClick = async (e, post) => {
    e.preventDefault();
    if (likes.includes(loggedInUser.id)) {
      const response = await fetch(`${apiUrl}/posts/like`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${loggedIn}`,
         "Content-Type": "application/json" },
        body: JSON.stringify({"post_id": post})
      })
      const res = await response.json();
      setLike([...res.likers])
    } else {
      const response = await fetch(`${apiUrl}/posts/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loggedIn}`,
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
        <Link to={post.private_supporter ? "/" : `/${post.username}`}>
          <div className="post-avatar"
            style={{ backgroundImage: `url(${post.author_avatar || "https://kafeen.s3.us-east-2.amazonaws.com/Screen+Shot+2020-09-20+at+11.52.11+PM.png"})`}} />
        </Link>
        <div className="post-info">
          <div>
            <strong>
              {post.private_supporter
              ? post.private_supporter
              : ( post.supporter === loggedInUser.username ||
                  post.supporter === loggedInUser.display_name ||
                  post.author === loggedInUser.username ||
                  post.author === loggedInUser.display_name )
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
        {post.image_url ? (
          <img
            className="post-body__image"
            alt="post" src={post.image_url} />
        ): null}
        <p className="post-body__text">{post.body}</p>
        {likes
        ?
        <div className="post-buttons">
        <button
          onClick={e => handleLikeClick(e, post.id, likes)}
          className={likes.includes(loggedInUser.id) ? "like-button liked" : "like-button"} >
          <i className="fa fa-heart" />
        </button>
        <span>&nbsp;{likes.length > 0 ? likes.length : null}</span>
        </div>
        : null}
      </div>
      </>
      : null}
    </div>

  )
}
