import { create } from 'zustand';

const useUiStore = create((set) => ({
  currentChannelId: null,
  setCurrentChannel: (currentChannelId) => set({ currentChannelId }),
}));

export default useUiStore;
