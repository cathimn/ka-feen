import React, { useContext, useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { AppContext } from '../AppContext';
import { apiUrl } from '../config';

import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

const SupportCard = ({ type, support }) => (
  <div style={{ marginTop: "15px" }}>
    <div style={{ display: "flex", marginBottom: "10px" }}>
      <img
        alt="avatar"
        className="post-avatar"
        src={type === "given" ? support.supported_avatar : support.author_avatar}
        onError={(e) => e.target.src = "https://kafeen.s3.us-east-2.amazonaws.com/Screen+Shot+2020-09-20+at+11.52.11+PM.png"} />
      <div style={{ display: "flex", flexDirection: "column", position: "relative", justifyContent: "space-evenly", left: "15px" }}>
        {type === "received"
          ? <span style={{ fontWeight: "600" }}>{support.private_supporter || support.supporter}</span>
          : <span>Supported:&nbsp;<span style={{ fontWeight: "600" }}>{support.supported}</span>&nbsp;
          {support.private_supporter && <span style={{ color: "gray", fontSize: "14px" }}> (Anonymously)</span>}</span>}
        <span style={{ color: "gray" }}>{support.posted_on}</span>
      </div>
    </div>
    <span>Amount: ${support.amount * 3}</span><br/>
    {support.body && <span>{type==="given" && "Your "}Message: {support.body}</span>}<br/>
    {/* {!support.private_supporter && type ==="given" &&
    <button id="mark-private">Make Private</button>} */}
    <div className="content-break" style={{ marginTop: "15px"}} />
  </div>
);

export default function () {
  const { currentUser } = useContext(AppContext);
  const [received, setReceived] = useState([]);
  const [given, setGiven] = useState([]);
  const [tab, setTab] = useState("received");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${apiUrl}/supports`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const responseData = await response.json();
      setReceived(responseData.received);
      setGiven(responseData.given)
      setLoaded(true);
    }
    fetchData();
  }, [currentUser.token])

  if (!currentUser.token) {
    return <Redirect to="/" />
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <SidebarNav />
        <div className="content">
          <h3 className="content-header">Support</h3>
          <div className="content-break" />
          <div style={{ alignSelf: "center", marginTop: "10px"}}>
            <button
              className={tab === "received" ? "support__tab-button selected" : "support__tab-button" }
              onClick={() => setTab("received")}>Received</button>
            <button
              className={tab === "given" ? "support__tab-button selected" : "support__tab-button" }
              onClick={() => setTab("given")}>Given</button>
          </div>
          {tab === "received" ?
            received.length === 0 && loaded ?
            <p style={{ textAlign: "center", marginTop: "50px" }}>
              Nothing to see here... <i className="fa fa-coffee" style={{ color: "slateblue" }} /><br/><br/>
              <span style={{ color: "gray"}}>To receive support, please ensure you have
              <br />"Accept Payments" enabled in&nbsp;
              <Link to="/settings"
                style={{
                  color: "darkslateblue",
                  textDecoration: "solid underline darkslateblue"}}>your settings</Link>!</span>
            </p>
            :
            received.map(support => <SupportCard key={support.id} type="received" support={support} />)
          : null}
          {tab === "given" ?
            given.length === 0 && loaded ?
            <p style={{ textAlign: "center", marginTop: "50px" }}>
              Nothing to see here... <i className="fa fa-coffee" style={{ color: "slateblue" }} /><br/><br/>
              <span style={{ color: "gray" }}>Find awesome creators to support<br/> on our&nbsp;
              <Link to="/explore"
                    style={{
                      color: "darkslateblue",
                      textDecoration: "solid underline darkslateblue"
                    }}>explore page</Link>!</span>
            </p>
            :
            given.map(support => <SupportCard key={support.id} type="given" support={support} />)
          :null}
        </div>
      </div>
    </>
  )
}
