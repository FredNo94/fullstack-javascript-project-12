import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../services/chatService';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { getState }) => {
    const { auth: { token } } = getState();
    const channels = await chatService.getChannels(token);
    return channels;
  },
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    currentChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel(state, action) {
      state.currentChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
        if (!state.currentChannelId && action.payload.length > 0) {
          state.currentChannelId = action.payload[0].id;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export const selectChannels = (state) => state.channelsInfo.channels;
export const selectCurrentChannelId = (state) => state.channelsInfo.currentChannelId;
export const selectCurrentChannel = (state) => {
  const { channelsInfo: { channels, currentChannelId } } = state;
  return channels.find((ch) => ch.id === currentChannelId) || null;
};
export default channelsSlice.reducer;