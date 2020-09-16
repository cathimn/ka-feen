import { apiUrl } from "../config";

const TOKEN_KEY = "ka-feen/authentication/token";
const USER_KEY = "ka-feen/authentication/user";

export const SET_TOKEN = "SET_TOKEN";
export const REMOVE_TOKEN = "REMOVE_TOKEN";

export const SET_USER = "SET_USER";
export const REMOVE_USER = "REMOVE_USER";

export const setToken = (token) => ({
  type: SET_TOKEN,
  token,
});

export const removeToken = () => ({
  type: REMOVE_TOKEN,
});

export const setUser = (user) => ({
  type: SET_USER,
  user
});

export const removeUser = () => ({
  type: REMOVE_USER,
});

export const loadToken = () => async (dispatch) => {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const user = window.localStorage.getItem(USER_KEY);

  if (token && user) {
    dispatch(setToken(token));
    dispatch(setUser(JSON.parse(user)));
  }
};

export const login = (email, password) => async (dispatch) => {
  const response = await fetch(`${apiUrl}/session`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { token, id, username } = await response.json();
    window.localStorage.setItem(TOKEN_KEY, token);
    const user = { id: id, username: username };
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    dispatch(setToken(token));
    dispatch(setUser(user));
  }
};

export const logout = () => async (dispatch, getState) => {
  const { authentication: { token } } = getState();
  const response = await fetch(`${apiUrl}/session/logout`, {
    method: "delete",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    dispatch(removeToken());
    dispatch(removeUser());
  }
};
