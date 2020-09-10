import React from 'react';
import { useSelector } from 'react-redux';

import { Redirect } from 'react-router-dom';

import Navbar from './Navbar';

export default function () {
  const loggedIn = useSelector((store) => store.authentication.token);

  if (loggedIn) {
    return <Redirect to='/newsfeed' />
  }

  return (
    <div>
      <Navbar />
      <div>
        COOL CONTENT
      </div>
    </div>
  );
}
