import React, { useEffect, useState } from 'react';
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

  const [privateDonation, setPrivateDonation] = useState(false);
  const [donationMessage, setDonationMessage] = useState("");
  const [supportAmount, setSupportAmount] = useState(1);

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
    if (loggedIn) {
      followingCheck();
    }
  }, [loggedIn, user])

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      "user_id": user,
      "supporter": loggedInUser.id,
      "amount": supportAmount,
      "body": donationMessage,
      "private": privateDonation,
    })
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
              id="support-button">
              <i className="fa fa-coffee" />
              &nbsp;Support
            </button>
            {isFollowing ? (
              <button id="following-button">
                <i className="fa fa-user" />
                <i className="fa fa-check" />
              </button>
            ) : (
              <button id="follow-button">Follow</button>
            )}
          </div>
        </div>
        <div className="userpage-main">
          <div className="userpage-left">
            <h3>
              Support {userPageInfo.display_name || userPageInfo.username}
            </h3>
            <p>{userPageInfo.bio}</p>
            {userPageInfo.tags ? userPageInfo.tags.map(el => <span>{el.tag_name}</span>) : null}
            {userPageInfo.total_support > 0
              ? <div><i className="fa fa-coffee"></i> x {userPageInfo.total_support} received</div> : null}
          </div>
          <div className="userpage-right">
            <div className="userpage-support">
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
                placeholder="Your message..."
                value={donationMessage}
                onChange={e => setDonationMessage(e.target.value)}></textarea><br/>
              <span
                onClick={e => setPrivateDonation(!privateDonation)}
                className={privateDonation ? "checkbox checked" : "checkbox"}>
                {privateDonation ? <i className="fa fa-check" /> : null}
              </span>
              <label>Anonymous donation</label><br/>
              <button
                disabled={supportAmount === 0}
                onClick={handleSubmit}>Donate ${supportAmount * 3}</button>
            </div>
            <div className="userpage-posts">
              <h3>Feed</h3>
              {userPageInfo.userpage_feed? userPageInfo.userpage_feed.map(post => {
                if (post.amount) {
                  return (
                  <Post key={post.id} post={post} support={userPageInfo.display_name || userPageInfo.username} />)
                } else {
                  return (
                  <Post key={post.id} post={post} />
                  )
                }}
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
