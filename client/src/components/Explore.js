import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../AppContext';
import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

function Explore () {
  const { currentUser } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(null);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [currentTag, setCurrentTag] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/users/tags`);
      const responseData = await response.json();
      setCategories(responseData.tags);
    }
    async function fetchFeatured() {
      const response = await fetch(`${apiUrl}/users/featured`);
      const responseData = await response.json();
      setFeatured([...responseData.users]);
    }
    fetchData();
    fetchFeatured();
  }, [])

  const handleSearch = (e) => {
    if (query.length === 0) {
      return;
    }
    e.preventDefault();
    async function search() {
      setSearched(false);
      const response = await fetch(`${apiUrl}/users/search=${query}`);
      const responseData = await response.json();
      setResults([...responseData.results]);
      setSearched(true);
    }
    search();
  }

  const fetchTaggedUsers = async (tagId, tag) => {
    const response = await fetch(`${apiUrl}/users/tag/id=${tagId}`);
    const responseData = await response.json();
    setCurrentTag(tag);
    setTaggedUsers([...responseData.users_with_tag]);
  }

  return (
    <>
      <Navbar/>
      <div className="container">
        {currentUser.token ? <SidebarNav /> : null}
        <div
          style={currentUser.token ? { width: "725px" } :{ width: "950px" }}
          className="content"
        >
          <span style={{ fontSize: "14px", color: "gray" }}>
            Explore Ka-feen
          </span>
          <h3 className="content-header">All Kinds of Creators Use Ka-feen</h3>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search creators"
              value={query}
              onChange={(e) => setQuery(e.target.value)}></input>
            <button type="submit">Search</button>
            <i className="fa fa-search" />
          </form>
          {results.length > 0 && searched
          ?
            <>
              <h3>Results</h3>
              <div style={currentUser.token
                ? { display: "grid", gridTemplateColumns: "1fr 1fr"}
                : { display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                {results.map(result =>
                <Link key={result.id} to={`/${result.username}`} >
                  <div className="explore-usercard">
                    <div
                      className="usercard-bigbanner"
                      style={{ backgroundImage: `url(${result.banner_url})` }}>
                    <img
                      className="usercard-bigavatar"
                          src={result.avatar_url}
                      alt="user avatar" />
                    </div>
                    <div className="usercard-biginfo">
                      <h3>{result.display_name || result.username}</h3>
                      <p>{result.bio}</p>
                      <button>View Page</button>
                    </div>
                  </div>
                </Link>)}
              </div>
            </>
          :
            <>
              <h3 className="content-header">Categories</h3>
              <ul className="explore-categories">
                <li className="explore-categories__tags"
                  onClick={() => {
                    setTaggedUsers([])
                    setCurrentTag(null)}}>
                  Featured
                </li>
                {categories.map((tag) => (
                  <li
                    key={tag.id}
                    className="explore-categories__tags"
                    onClick={() => fetchTaggedUsers(tag.id, tag.tag_name)}>
                    {tag.tag_name}
                  </li>
                ))}
              </ul>
              {taggedUsers.length > 0
              ?
              <>
              <h3 className="content-header">Users tagged with {currentTag}</h3>
              <div style={currentUser.token
                ? { display: "grid", gridTemplateColumns: "1fr 1fr" }
                : { display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              {taggedUsers.map(user =>
                <Link key={user.id} to={`/${user.username}`} >
                  <div className="explore-usercard">
                    <div
                      className="usercard-bigbanner"
                      style={{ backgroundImage: `url(${user.banner_url})` }}>
                      <img
                        className="usercard-bigavatar"
                        src={user.avatar_url}
                        alt="user avatar" />
                    </div>
                    <div className="usercard-biginfo">
                      <h3>{user.display_name || user.username}</h3>
                      <p>{user.bio}</p>
                      <button>View Page</button>
                    </div>
                  </div>
                </Link>)}
              </div>
              </>
              :
              <>
              {currentTag !== null ? <h3 className="content-header">No results for {currentTag}</h3> : ""}
              <h3 className="content-header">Featured Creators</h3>
              <div style={currentUser.token
                ? { display: "grid", gridTemplateColumns: "1fr 1fr" }
                : { display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              {featured.map(user =>
                <Link key={user.id} to={`/${user.username}`} >
                  <div className="explore-usercard">
                    <div
                      className="usercard-bigbanner"
                      style={{ backgroundImage: `url(${user.banner_url})` }}>
                      <img
                        className="usercard-bigavatar"
                        src={user.avatar_url}
                        alt="user avatar" />
                    </div>
                    <div className="usercard-biginfo">
                      <h3>{user.display_name || user.username}</h3>
                      <p>{user.bio}</p>
                      <button>View Page</button>
                    </div>
                  </div>
                </Link>)}
                </div>
              </>}
            </>}
        </div>
      </div>
    </>
  );
}

export default Explore;
