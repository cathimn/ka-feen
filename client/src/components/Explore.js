import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../AppContext';
import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

const ExploreCard = ({ user }) => (
  <div className="explore-usercard">
    <Link to={`/${user.username}`} >
      <div
        className="usercard-bigbanner"
        style={{ backgroundImage: `url(${user.banner_url})` }}>
        <img
          onError={(e) => e.target.src = "https://kafeen.s3.us-east-2.amazonaws.com/Screen+Shot+2020-09-20+at+11.52.11+PM.png"}
          className="usercard-bigavatar"
          src={user.avatar_url}
          alt="user avatar" />
      </div>
      <div className="usercard-biginfo">
        <h3>{user.display_name || user.username}</h3>
        <p>{user.bio}</p>
        <button>View Page</button>
      </div>
    </Link>
  </div>
)

function Explore () {
  const categories = [
    { id: 1, tag_name: "Animation" },
    { id: 2, tag_name: "Art" },
    { id: 3, tag_name: "Comics" },
    { id: 4, tag_name: "Drawing & Painting" },
    { id: 5, tag_name: "Food & Drink" },
    { id: 6, tag_name: "Gaming" },
    { id: 7, tag_name: "Music" },
    { id: 8, tag_name: "Other" },
    { id: 9, tag_name: "Photography" },
    { id: 10, tag_name: "Podcast" },
    { id: 11, tag_name: "Science & Tech" },
    { id: 12, tag_name: "Social" },
    { id: 13, tag_name: "Software" },
    { id: 14, tag_name: "Streaming" },
    { id: 15, tag_name: "Video & Film" },
    { id: 16, tag_name: "Writing" }];
    
  const { currentUser } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState(query);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(null);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [currentTag, setCurrentTag] = useState({ "tag": null, "id": null });

  useEffect(() => {
    async function fetchFeatured() {
      const response = await fetch(`${apiUrl}/users/featured`);
      const responseData = await response.json();
      setFeatured([...responseData.users]);
    }
    // fetchData();
    fetchFeatured();
  }, [])

  const handleSearch = (e) => {
    setLastQuery(query);
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
    setCurrentTag({ tag, tagId });
    setTaggedUsers([...responseData.users_with_tag]);
  }

  const scrollRight = e => {
    e.preventDefault();
    document.getElementById("categories").scrollBy(550, 0);
  }
  const scrollLeft = e => {
    e.preventDefault();
    document.getElementById("categories").scrollBy(-550, 0);
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
              onChange={(e) => {setQuery(e.target.value)}}></input>
            <button type="submit">Search</button>
            <i className="fa fa-search" />
          </form>
          {searched && results.length > 0 ?
            <>
              <h3>Results for "{lastQuery}"</h3>
              <div style={currentUser.token
                ? { display: "grid", gridTemplateColumns: "1fr 1fr"}
                : { display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                {results.map(user => <ExploreCard key={user.id} user={user} />)}
              </div>
            </>
          :
            <>
              {searched && results.length === 0 ? <h3>No results for "{lastQuery}"</h3> : null}
              <h3 className="content-header">Categories</h3>
              <div id="categories-container">
                <button id="scroll-left" className="categories-buttons" onClick={scrollLeft}><i className="fa fa-chevron-left" /></button>
                <button id="scroll-right" className="categories-buttons" onClick={scrollRight}><i className="fa fa-chevron-right" /></button>
                <ul id="categories" className="explore-categories">
                  <li className="explore-categories__tags"
                    onClick={() => {
                      setTaggedUsers([])
                      setCurrentTag({ "tag": null, "id": null })}}>
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
                  <li style={{ width: "50px"}}>&nbsp;</li>
                </ul>
              </div>
              {taggedUsers.length > 0 ?
              <>
                <h3 className="content-header">Users tagged with {currentTag.tag}</h3>
                <div style={currentUser.token
                  ? { display: "grid", gridTemplateColumns: "1fr 1fr" }
                  : { display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                {taggedUsers.map(user => <ExploreCard key={user.id} user={user} />)}
                </div>
                </>
              :
              <>
                {currentTag.tag !== null ? <h3 className="content-header">No results for {currentTag.tag}</h3> : ""}
                <h3 className="content-header">Featured Creators</h3>
                <div style={currentUser.token
                  ? { display: "grid", gridTemplateColumns: "1fr 1fr" }
                  : { display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
                  {featured.map(user => <ExploreCard key={user.id} user={user} />)}
                </div>
              </>}
            </>}
        </div>
      </div>
    </>
  );
}

export default Explore;
