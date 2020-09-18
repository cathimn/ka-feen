import React, { useEffect, useState, useRef } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { apiUrl } from '../config';

import Navbar from './Navbar';
import EditUserPage from './EditUserPage';
import Post from './Post';

export default function () {
  const { user } = useParams();
  const loggedIn = useSelector((store) => store.authentication.token);
  const loggedInUser = useSelector((store) => store.authentication.user);
  const [loaded, setLoaded] = useState(false);
  const [userPageInfo, setUserPageInfo] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [newPost, setNewPost] = useState(null);
  const [privateDonation, setPrivateDonation] = useState(false);
  const [donationMessage, setDonationMessage] = useState("");
  const [supportAmount, setSupportAmount] = useState(1);
  const [feedPage, setFeedPage] = useState(0);

  useEffect(() => {
    async function fetchUserPageInfo() {
      const response = await fetch(`${apiUrl}/users/${user}`);
      if (response.ok) {
        const data = await response.json();
        setUserPageInfo({ ...data });
      }
      setLoaded(true);
    }

    async function followingCheck() {
      const response = await fetch(`${apiUrl}/follows`, {
        headers: { Authorization: `Bearer ${loggedIn}` },
      });
      const data = await response.json();
      const usernames = data.following.map((user) => user.username);
      setIsFollowing(usernames.includes(user));
    }

    fetchUserPageInfo();
    setNewPost(false);
    if (loggedIn) {
      followingCheck();
    }
  }, [loggedIn, user, newPost])

  useEffect(() => {
    async function addToFeed() {
      const response = await fetch(`${apiUrl}/users/${user}/page=${feedPage}`);
      const data = await response.json();
      // const feed = data.userpage_feed;
    }
  }, [feedPage])

  const handleSupportClick = () => {
    document.getElementById("support").focus();
    const supportBox = document.getElementById("support-box");
    window.scrollTo({ top: supportBox.offsetTop - 75, left: 0, behavior: "smooth" });
    supportBox.classList.add("focus");
    setTimeout(() => {supportBox.classList.remove("focus")}, 1000)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${apiUrl}/supports`, {
      method: "POST",
      headers: { Authorization: `Bearer ${loggedIn}`, "Content-Type": "application/json" },
      body: JSON.stringify({
          "user_id": userPageInfo.id,
          "supporter_id": loggedInUser.id,
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

  const follow = async () => {
    const response = await fetch(`${apiUrl}/follows`, {
      method: "POST",
      headers: { Authorization: `Bearer ${loggedIn}`, "Content-Type": "application/json" },
      body: JSON.stringify({ "follow": user })
    })
    if (response.ok) setIsFollowing(true);
  }

  const unfollow = async () => {
    const response = await fetch(`${apiUrl}/follows`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${loggedIn}`, "Content-Type": "application/json" },
      body: JSON.stringify({ "unfollow": user })
    })
    if (response.ok) setIsFollowing(false)
  }

  if (!loaded) {
    return null;
  }

  if (loaded && user === loggedInUser.username) {
    return <EditUserPage />
  }

  if (loaded && Object.keys(userPageInfo).length === 0) {
    return <Redirect to="/notfound" />
  }

  return (
    <>
      <Navbar />
      <div
        style={
          userPageInfo.banner_url
            ? {
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundImage: `url(${userPageInfo.banner_url})`,
                height: "250px",
              }
            : { dispay: "hidden" }
        }
      />
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
            <div
              className="userpage-avatar"
              style={{
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundImage: `url(${userPageInfo.avatar_url})` }}
            />
            <div className="userpage-info">
              <div>Buy some caffeine for</div>
              <h1>{userPageInfo.display_name || userPageInfo.username}</h1>
              <div style={{ color: "slategray" }}>
                ka-feen.herokuapp.com/{userPageInfo.username}
              </div>
            </div>
          </div>
          <div className="userpage-buttons">
            <button
              onClick={handleSupportClick}
              className={userPageInfo.accept_payments ? "" : "hidden"}
              id="support-button">
              <i className="fa fa-coffee" />
              &nbsp;Support
            </button>
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
              {privateDonation ? <i className="fa fa-check" /> : null}
            </span>
            <label>Anonymous donation</label><br />
            <button
              disabled={supportAmount === 0}
              onClick={handleSubmit}>Donate ${supportAmount * 3}</button>
            {loggedInUser
              ?
              <div style={{
                textAlign: "center",
                marginTop: "10px"
              }}>
                Signed in as {loggedInUser.display_name || loggedInUser.username}
              </div> : null}
          </div>
          <div className="userpage-posts">
            <h3>Feed</h3>
            {userPageInfo.userpage_feed
              ? userPageInfo.userpage_feed.map(post => {
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
            <button onClick={() => setFeedPage(feedPage + 1)}>Load more...</button>
          </div>
        </div>
      </div>
    </>
  );
}
