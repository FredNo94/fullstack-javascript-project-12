import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setAuth, removeAuth } from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

window.addEventListener('storage', (e) => {
  if (e.key === 'token') {
    if (e.newValue) {
      const username = localStorage.getItem('username');
      store.dispatch(setAuth({ token: e.newValue, username }));
    } else {
      store.dispatch(removeAuth());
    }
  }

  if (e.key === 'username') {
    const token = localStorage.getItem('token');
    if (token) {
      store.dispatch(setAuth({ token, username: e.newValue }));
    }
  }
});

export default store;
