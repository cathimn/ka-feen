import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { apiUrl } from '../config';
import { update } from '../actions/authentication';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';
import { Redirect } from 'react-router-dom';

export default function () {
  const dispatch = useDispatch();
  const loggedIn = useSelector((store) => store.authentication.token);
  const [loaded, setLoaded] = useState(false);
  const [tags, setTags] = useState([]);
  const [userData, setUserData] = useState({});
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [userTags, setUserTags] = useState([]);
  const [payment, setPayment] = useState(null);
  const [paymentChanged, setPaymentChanged] = useState(null);
  const [tagsToAdd, setTagsToAdd] = useState([]);
  const [tagsToRemove, setTagsToRemove] = useState([]);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/users/tags`);
      const responseData = await response.json();
      setTags(responseData.tags);
      
      const requestUserInfo = await fetch(`${apiUrl}/users/settings`, {
        headers: { Authorization: `Bearer ${loggedIn}` },
      });
      const userInfoData = await requestUserInfo.json();
      setUserData(userInfoData);
      setUserTags(userInfoData.tags);
      setPayment(userInfoData.accept_payments);
    }
    
    if (loggedIn) {
      fetchData();
    }
    
    setLoaded(true);
  }, [loggedIn])

  const removeTag = (e, id) => {
    e.preventDefault();
    setTagsToRemove([...tagsToRemove, id]);
    const newTags = userTags.filter(ele => ele.id !== id);
    setUserTags([...newTags]);
  }

  const addTag = (e, id, tagname) => {
    e.preventDefault();
    setTagsToAdd([...tagsToAdd, id]);
    if (!userTags.map(usertag => usertag.id).includes(id)) {
      setUserTags([...userTags, {"id": id, "tag_name": tagname}])
    }
  }

  const handleToggle = e => {
    setPayment(!payment);
    setPaymentChanged(true);
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch(`${apiUrl}/users/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${loggedIn}`,
        "Content-Type": "application/json" },
      body: JSON.stringify({
        "username": username && username !== userData.username ? username : null,
        "display_name": displayName && displayName !== userData.display_name ? displayName : null,
        "accept_payments": payment,
        "bio": bio && bio !== userData.bio ? bio : null,
        "tags_to_add": tagsToAdd,
        "tags_to_remove": tagsToRemove,
      }),
    });

    if (response.ok) {
      const res = await response.json();
      setUsername('');
      setDisplayName('');
      setBio('');
      setUserData({...res})
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
      setUpdated(true);
      console.log(res)
      dispatch(update(res.id, res.username, res.display_name));
    }
  }

  if (!loggedIn && loaded) {
    return <Redirect to="/" />
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <SidebarNav />
        {updated ?
        <div className="success-toast">
          Successfully updated your <Link to={userData.username}>profile</Link>!&nbsp;
          <button onClick={() => setUpdated(false)}>
            <i className="fa fa-close" />
          </button></div> : null}
        <div className="content" style={{ width: "750px" }}>
          <h3 className="content-header">Settings</h3>
          <div className="content-break" />
          <form className="settings-form" name="settings">
            <div>
              <label htmlFor="displayName">Display Name</label> <br />
              <input
                type="text"
                name="displayName"
                placeholder={userData.display_name}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                ></input>
            </div>
            <div>
              <label htmlFor="username">Username</label> <br />
              <input
                type="text"
                name="username"
                placeholder={userData.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ></input>
            </div>
            <div>
              <label htmlFor="bio">About You</label> <br />
              <textarea
                name="bio"
                rows="5"
                placeholder={userData.bio}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label>Accept "Payments"</label> <br />
              <div
                onClick={handleToggle}
                htmlFor="payments"
                className="slider"
                style={payment ? { backgroundColor: "lavender" } : { backgroundColor: "lightgray"}}>
                <div className={payment ? "slider-true" : "slider-false"}>
                  <i className={payment ? "fa fa-check" : ""} />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="tags">What do you do?</label><br />
              <ul className="settings-tags">
                {userTags.map(tag =>
                  <li key={tag.id}>
                    <span>{tag.tag_name}</span>
                    <button onClick={(e) => removeTag(e, tag.id)} ><i className="fa fa-close" /></button>
                  </li>)}
              </ul>
              <div className="content-break" style={{marginBottom: "10px"}} />
              <label>Add additional tags</label>
              <ul className="settings-tags">
                {tags.filter(tag => !userTags.map(usertag => usertag.id).includes(tag.id)).map(tag =>
                  <li key={tag.id} className="unselected"><span>{tag.tag_name}</span>
                  <button onClick={(e) => addTag(e, tag.id, tag.tag_name)}><i className="fa fa-plus"/></button></li>)}
              </ul>
            </div>
            <button
            id="setting-submit"
            disabled={
              username === "" &&
              displayName === "" &&
              bio === "" &&
              tagsToAdd.length === 0 &&
              tagsToRemove.length === 0 &&
              !paymentChanged}
            onClick={handleSubmit} htmlFor="settings" type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </>
  );
}
