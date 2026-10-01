import { useContext, useEffect } from 'react';
import AppApiContext from '../contexts/AppApiContext';

export default function AppLifecycle() {
  const api = useContext(AppApiContext);
  useEffect(() => api.start(), [api]);
  return null;
}

