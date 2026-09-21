import { create } from 'zustand';

const useUiStore = create((set) => ({
  currentChannelId: null,
  modal: null,
  openModal: (type, channelId = null) => set({ modal: { type, channelId } }),
  closeModal: () => set({ modal: null }),
  setCurrentChannel: (currentChannelId) => set({ currentChannelId }),
}));

export default useUiStore;
