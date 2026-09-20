import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const hasToken = (token) => typeof token === 'string'
  && token.trim().length > 0 && token !== 'undefined' && token !== 'null';

const useAuthStore = create(persist(
  (set) => ({
    token: null,
    username: null,
    setAuth: ({ token, username }) => set({ token, username }),
    removeAuth: () => set({ token: null, username: null }),
  }),
  {
    name: 'chat-auth',
    storage: createJSONStorage(() => localStorage),
    partialize: ({ token, username }) => ({ token, username }),
    merge: (saved, current) => ({
      ...current,
      token: hasToken(saved?.token) ? saved.token : null,
      username: typeof saved?.username === 'string' ? saved.username : null,
    }),
  },
));

if (!localStorage.getItem('chat-auth') && hasToken(localStorage.getItem('token'))) {
  useAuthStore.getState().setAuth({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
  });
}
localStorage.removeItem('token');
localStorage.removeItem('username');

window.addEventListener('storage', (event) => {
  if (event.storageArea === localStorage && (event.key === 'chat-auth' || event.key === null)) {
    void useAuthStore.persist.rehydrate();
  }
});

export const selectIsAuthenticated = (state) => hasToken(state.token);
export default useAuthStore;
