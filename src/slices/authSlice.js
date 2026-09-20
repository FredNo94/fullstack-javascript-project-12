import { createSlice } from '@reduxjs/toolkit';

const isValidToken = (token) => (
  typeof token === 'string'
  && token.length > 0
  && token !== 'undefined'
  && token !== 'null'
);

const getStoredToken = () => {
  const token = localStorage.getItem('token');
  return isValidToken(token) ? token : null;
};

const getStoredUsername = () => {
  const username = localStorage.getItem('username');
  return username && username !== 'undefined' ? username : null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getStoredToken(),
    username: getStoredUsername(),
  },
  reducers: {
    setAuth(state, { payload: { token, username } }) {
      if (!isValidToken(token) || !username) {
        return;
      }

      state.token = token;
      state.username = username;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    },
    removeAuth(state) {
      state.token = null;
      state.username = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
  },
});

export const { setAuth, removeAuth } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => isValidToken(state.auth.token);
export default authSlice.reducer;
