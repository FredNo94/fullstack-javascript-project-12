import useAuthStore from '../authStore';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../services/chatService';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async () => {
    const { token } = useAuthStore.getState();
    const messages = await chatService.getMessages(token);
    return messages;
  },
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectMessages = (state) => state.messagesInfo.messages;
export default messagesSlice.reducer;