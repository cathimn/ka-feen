import React from 'react';

export default ({ post }) => (
  <div className="post-container">
    <div className="post-header">
      <div className="post-avatar" />
      <div className="post-info">
        <div>{post.author}</div>
        <div>{post.posted_on}</div>
      </div>
    </div>
    <div className="post-arrow"></div>
    <div className="post-body">
      {post.image_url ? (
        <img className="post-body__image" alt="post" src={post.image_url} />
      ) : null}
      <p className="post-body__text">{post.body}</p>
      <div className="post-buttons">
        <div className="post-like">
          <button className="like-button">
            <i className="fa fa-heart" />
            <span>&nbsp; 350</span>
          </button>
        </div>
        <div className="post-remove">
          {/* <i className="fa fa-ellipsis-h" /> */}
        </div>
      </div>
    </div>
  </div>
);
