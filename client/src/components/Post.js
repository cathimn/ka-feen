import React from 'react';

export default function ({ post, support }) {

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="post-avatar" />
        <div className="post-info">
          <div><strong>{post.author}</strong>{support ? <span>&nbsp;bought some caffeine for <strong>{support}</strong></span> : null}</div>
          <div>{post.posted_on}</div>
        </div>
      </div>
      {post.body
      ?
      <>
      <div className="post-arrow"></div>
      <div className="post-body">
        {post.image_url ? (
          <img className="post-body__image" alt="post" src={post.image_url} />
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
