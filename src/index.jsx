import './monitoring.js';
import { captureException, reactErrorHandler } from '@sentry/react';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import init from './init.jsx';

const app = async () => {
  const socket = io();

  try {
    const markup = await init(socket);
    const root = ReactDOM.createRoot(document.querySelector('#root'), {
      onUncaughtError: reactErrorHandler(),
      onCaughtError: reactErrorHandler(),
      onRecoverableError: reactErrorHandler(),
    });
    root.render(markup);
  } catch (error) {
    socket.disconnect();
    throw error;
  }

  if (import.meta.hot) {
    import.meta.hot.dispose(() => socket.disconnect());
  }
};

app().catch((error) => {
  captureException(error);
  console.error(error);
});
