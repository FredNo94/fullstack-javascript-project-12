import { useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import StoresContext from '../contexts/StoresContext';

export default function SessionLifecycle() {
  const { auth, ui } = useContext(StoresContext);
  const client = useQueryClient();
  useEffect(() => {
    const sync = (event) => {
      if (event.storageArea === localStorage && (event.key === 'chat-auth' || event.key === null)) {
        void auth.persist.rehydrate();
      }
    };
    const unsubscribe = auth.subscribe((state, previous) => {
      if (state.token !== previous.token) {
        client.clear();
        ui.getState().reset();
      }
    });
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('storage', sync);
      unsubscribe();
      client.clear();
    };
  }, [auth, ui, client]);
  return null;
}
