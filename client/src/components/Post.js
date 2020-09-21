import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function ({ post }) {
  const loggedInUser = useSelector((store) => store.authentication.user);

  return (
    <div className="post-container">
      <div className="post-header">
        <Link to={post.private_supporter ? "/" : `/${post.username}`}>
          <div className="post-avatar"
            style={{
              backgroundImage: `url(${post.author_avatar || "https://kafeen.s3.us-east-2.amazonaws.com/Screen+Shot+2020-09-20+at+11.52.11+PM.png"})`,
              backgroundPosition: "center",
              backgroundSize: "cover"}} />
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
      </div>
      </>
      : null}
        {/* <div className="post-buttons">
          <div className="post-like">
            <button className="like-button">
              <i className="fa fa-heart" />
              <span>&nbsp; 350</span>
            </button>
          </div>
          <div className="post-remove">
            <i className="fa fa-ellipsis-h" />
          </div>
        </div> */}
    </div>

  )
}
