import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { login } from '../actions/authentication'
import { Redirect } from "react-router-dom";

export default function () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const loggedIn = useSelector(store => store.authentication.token)

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }

    if (loggedIn) {
        return <Redirect to="/newsfeed" />
    }

    return ( 
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email" />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password" />
                <button>LOG IN</button>
            </form>
        </div>
    );
}
