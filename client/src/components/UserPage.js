import React, { useEffect, useState, useContext } from 'react';
import { useParams, Redirect } from 'react-router-dom';

import { apiUrl } from '../config';
import { AppContext } from '../AppContext';

import Navbar from './Navbar';
import Post from './Post';

export default function () {
  const { user } = useParams();
  const { currentUser, setLoginModalDisplay } = useContext(AppContext);

  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userPageInfo, setUserPageInfo] = useState({ tags: [], userpage_feed: [] });
  const [isFollowing, setIsFollowing] = useState(null);
  const [feedPage, setFeedPage] = useState(1);
  const [newPost, setNewPost] = useState(false);
  const [privateDonation, setPrivateDonation] = useState(false);
  const [donationMessage, setDonationMessage] = useState("");
  const [supportAmount, setSupportAmount] = useState(1);
  const [invalidUser, setInvalidUser] = useState(null);

  useEffect(() => {
    async function fetchUserPageInfo() {
      const response = await fetch(`${apiUrl}/users/${user}`);
      if (response.ok) {
        const data = await response.json();
        setUserPageInfo({ ...data });
        if (currentUser.token) {
          const response = await fetch(`${apiUrl}/follows`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          });
          const data = await response.json();
          const usernames = data.following.map((user) => user.username);
          setIsFollowing(usernames.includes(user));
        }
      } else {
        setInvalidUser(true);
      }
      setLoaded(true);
    }

    fetchUserPageInfo();
    setNewPost(false);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, newPost, currentUser.token])

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    const loadMore = document.getElementById("load-more");
    if (loadMore) loadMore.click()
  }

  const addToFeed = async () => {
    setLoading(true);
    const response = await fetch(`${apiUrl}/users/${user}/page=${feedPage}`);
    const data = await response.json();
    const end = data.end_of_feed;
    const feed = data.userpage_feed;
    const current = userPageInfo.userpage_feed;
    setLoading(false);
    setUserPageInfo({
      ...userPageInfo,
      "end_of_feed": end,
      "userpage_feed": [...current, ...feed]
    })
    setFeedPage(feedPage + 1);
  }

  const handleSupportClick = () => {
    document.getElementById("support").focus();
    const supportBox = document.getElementById("support-box");
    window.scrollTo({ top: supportBox.offsetTop - 75, left: 0, behavior: "smooth" });
    supportBox.classList.add("focus");
    setTimeout(() => {supportBox.classList.remove("focus")}, 1000)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser.token) {
      setLoginModalDisplay(true);
      return
    } else {
      await fetch(`${apiUrl}/supports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          "Content-Type": "application/json" },
        body: JSON.stringify({
            "user_id": userPageInfo.id,
            "supporter_id": currentUser.id,
            "amount": supportAmount,
            "body": donationMessage,
            "private": privateDonation,
          })
      });
      setNewPost(true);
      setSupportAmount(1);
      setDonationMessage("");
      setPrivateDonation(false);
    }
  }

  const follow = async () => {
    if (!currentUser.token) {
      setLoginModalDisplay(true);
      return;
    }
    const response = await fetch(`${apiUrl}/follows`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
        "Content-Type": "application/json" },
      body: JSON.stringify({ "follow": user })
    })
    if (response.ok) setIsFollowing(true);
  }

  const unfollow = async () => {
    const response = await fetch(`${apiUrl}/follows`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
        "Content-Type": "application/json" },
      body: JSON.stringify({ "unfollow": user })
    })
    if (response.ok) setIsFollowing(false)
  }

  if (!loaded) {
    return null;
  }

  if (loaded && invalidUser) {
    return <Redirect to="/notfound" />
  }

  return (
    <>
      <Navbar />
      {userPageInfo.banner_url ?
      <div
        className="userpage-banner"
        style={{ backgroundImage: `url(${userPageInfo.banner_url})` }}/>
      : null}
      <div
        className="userpage-container"
        style={
          userPageInfo.banner_url
            ? { marginTop: "25px" }
            : { marginTop: "100px" }
        }
      >
        <div className="userpage-topbar">
          <div className="userpage-avatarinfo">
            <img
              onError={(e) => e.target.src = "https://kafeen.s3.us-east-2.amazonaws.com/Screen+Shot+2020-09-20+at+11.52.11+PM.png"}
              alt="avatar"
              className="userpage-avatar"
              src={userPageInfo.avatar_url} />
            <div className="userpage-info" style={ !userPageInfo.accept_payments ? { display: "flex", flexDirection: "column", justifyContent: "center"} : {}}>
              <div>{userPageInfo.accept_payments ? "Buy some caffeine for" : null}</div>
              <h1>{userPageInfo.display_name || userPageInfo.username}</h1>
              <div style={{ color: "slategray" }}>
                ka-feen.herokuapp.com/{userPageInfo.username}
              </div>
            </div>
          </div>
          <div className="userpage-buttons">
            {userPageInfo.accept_payments ?
            <button
              onClick={handleSupportClick}
              id="support-button">
              <i className="fa fa-coffee" />
              &nbsp;Support
            </button> : null}
            {isFollowing ? (
              <button id="following-button" onClick={unfollow}>
                <i className="fa fa-user" />&nbsp;
                <i className="fa fa-check" />
              </button>
            ) : (
              <button id="follow-button" onClick={follow}>Follow</button>
            )}
          </div>
        </div>
      </div>
      <div className="userpage-main">
        <div className="userpage-left">
          <h3>
            <span>
              {userPageInfo.accept_payments ? "Support" : "About"}</span>&nbsp;
              {userPageInfo.display_name || userPageInfo.username}
          </h3>
          <p style={{ margin: "10px 0" }}>{userPageInfo.bio}</p>
          {userPageInfo.tags.length > 0 ?
          <div className="userpage-tag_container">
            {userPageInfo.tags
              ?
              userPageInfo.tags.map(el =>
                <span key={el.id} className="userpage-tag">
                  {el.tag_name}</span>)
              : null}
          </div>
          : null}
          {userPageInfo.total_support > 0 ?
            <div style={{ fontSize: "18px", marginTop: "10px"  }}>
              <div><i className="fa fa-coffee" />&nbsp;x&nbsp;
              <strong>{userPageInfo.total_support}</strong>
              &nbsp;Received</div> 
          </div>
          : null}
        </div>
        <div className="userpage-right">
          <div
            id="support-box"
            className={userPageInfo.accept_payments ? "userpage-support" : "hidden"}>
            <h3>
              Buy some caffeine for{" "}
              {userPageInfo.display_name || userPageInfo.username}
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: "20px", alignSelf: "center" }}>
                <i className="fa fa-coffee" /> $3 each
                </div>
              <form id="support-form" onSubmit={e => e.preventDefault()}>
                <button
                  type="button"
                  disabled={supportAmount === 1}
                  onClick={() => setSupportAmount(supportAmount - 1)}
                ><i className="fa fa-minus" /></button>
                <input
                  type="number"
                  min="1"
                  onChange={(e) => setSupportAmount(Number(e.target.value))}
                  value={supportAmount} ></input>
                <button
                  onClick={() => setSupportAmount(supportAmount + 1)}
                ><i className="fa fa-plus" /></button>
              </form>
            </div>
            <textarea
              id="support"
              placeholder="Your message..."
              value={donationMessage}
              onChange={e => setDonationMessage(e.target.value)}></textarea><br />
            <span
              onClick={e => setPrivateDonation(!privateDonation)}
              className={privateDonation ? "checkbox checked" : "checkbox"}>
              {privateDonation && <i className="fa fa-check" />}
            </span>
            <label>Anonymous donation</label><br />
            <button
              disabled={supportAmount === 0}
              onClick={handleSubmit}>Donate ${supportAmount * 3}</button>
            {currentUser.token
              ?
              <div style={{
                margin: "15px auto 0px auto",
                fontSize: "14px",
                width: "min-content",
                whiteSpace: "nowrap",
              }}>
                Signed in as {currentUser.displayName || currentUser.username}
              </div> : null}
          </div>
          <div className="userpage-posts">
            <h3>Feed</h3>
            {userPageInfo.userpage_feed.length === 0 && loaded ?
            <div style={{marginTop: "10px"}}>
              No activity yet.
            </div>
            :
            userPageInfo.userpage_feed.map(post => {
              if (post.amount) {
                return <Post key={"support" + post.id} post={post} support={userPageInfo.display_name || userPageInfo.username} />
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
    </>
  );
}
