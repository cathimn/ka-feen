import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

function Explore () {
  const loggedIn = useSelector((store) => store.authentication.token);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/users/tags`);
      const responseData = await response.json();
      setCategories(responseData.tags);
    }
    fetchData();
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

  const fetchTaggedUsers = (e) => {
    console.log(e.target.id)
  }

  return (
    <>
      <Navbar />
      <div className="container">
        {loggedIn ? <SidebarNav /> : null}
        <div
          className="content"
          style={
            loggedIn
              ? { display: "grid", gridTemplateColumns: "1fr" }
              : { display: "grid", gridTemplateColumns: "1fr", gridColumn: "1/3" }
          }
        >
          <span style={{ fontSize: "14px", color: "gray" }}>
            Explore Ka-feen
          </span>
          <h3 className="content-header">All Kinds of Creators Use Ka-feen</h3>
          <form className="search-form" onSubmit={handleSearch}>
            <input type="text" placeholder="Search creators" value={query} onChange={(e) => setQuery(e.target.value)}></input>
            <button type="submit">Search</button>
            <i className="fa fa-search" />
          </form>
          {results.length > 0 && searched
          ?
            <>
              <h3>Results</h3>
              <div style={loggedIn
                ? { display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}
                : { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                {results.map(result =>
                <Link to={`/${result.username}`} >
                  <div className="explore-usercard">
                    <div
                      className="usercard-bigbanner"
                      style={{ backgroundImage: `url(${result.banner_url})` }}>
                    <img
                      className="usercard-bigavatar"
                      src={result.avatar_url} />
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
                {categories.map((tag) => (
                  <li
                    key={tag.id}
                    className="explore-categories__tags" onClick={fetchTaggedUsers}>
                    {tag.tag_name}
                  </li>
                ))}
              </ul>
              <h3 className="content-header">Featured Creators</h3>
            </>}
        </div>
      </div>
    </>
  );
}

export default Explore;
