import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice';
import messagesReducer from './slices/messagesSlice';

const store = configureStore({
  reducer: {
    channelsInfo: channelsReducer,
    messagesInfo: messagesReducer,
  },
});

export default store;
