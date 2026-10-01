import { createStore } from 'zustand/vanilla';
import { useContext } from 'react';
import { useStore } from 'zustand';
import StoresContext from './contexts/StoresContext.js';

export const createUiStore = () => createStore((set) => ({
  currentChannelId: null,
  connectionStatus: 'connecting',
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  reset: () => set({ currentChannelId: null, modal: null }),
  modal: null,
  openModal: (type, channelId = null) => set({ modal: { type, channelId } }),
  closeModal: () => set({ modal: null }),
  setCurrentChannel: (currentChannelId) => set({ currentChannelId }),
}));

const useUiStore = (selector) => useStore(useContext(StoresContext).ui, selector);
export default useUiStore;
