import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

function Explore () {
  const loggedIn = useSelector((store) => store.authentication.token);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/users/tags`);
      const responseData = await response.json();
      setCategories(responseData.tags);
    }
    fetchData();
  }, [])

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
          <form className="search-form">
            <input type="text" placeholder="Search creators"></input>
            <button type="submit">Search</button>
            <i className="fa fa-search" />
          </form>
          <h3 className="content-header">Categories</h3>
          <ul
            style={{
              display: "flex",
              overflow: "auto",
              margin: "0px 30px 20px 30px",
              height: "100px",
            }}
          >
            {categories.map((tag) => (
              <Link
                key={tag.id}
                to={`${tag.id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <li
                  style={{
                    padding: "20px 25px",
                    margin: "20px",
                    boxShadow: "0 0 15px lavender",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    width: "125px",
                    height: "15px",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  {tag.tag_name}
                </li>
              </Link>
            ))}
          </ul>
          <h3 className="content-header">Featured Creators</h3>
        </div>
      </div>
    </>
  );
}

export default Explore;
