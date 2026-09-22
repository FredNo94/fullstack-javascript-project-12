import React from 'react';
import { I18nextProvider } from 'react-i18next';
import createI18n from './i18n.js';
import { MantineProvider } from '@mantine/core';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';
import { isAxiosError } from 'axios';
import { showRequestError, showNetworkError } from './toasts';
import NetworkNotifications from './components/NetworkNotifications';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import App from './App.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import SocketContext from './contexts/SocketContext.js';

const init = async (socket) => {
  const i18n = await createI18n();
  document.title = i18n.t('app.name');
  const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: (error) => showRequestError(error, i18n.t.bind(i18n)) }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isAxiosError(error) && !error.response) showNetworkError(i18n.t.bind(i18n));
      },
    }),
  });
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          element: <ProtectedRoute />,
          children: [
            { index: true, element: <HomePage /> },
          ],
        },
        { path: 'login', element: <LoginPage /> },
        { path: 'signup', element: <SignupPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);

  return (
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
      <SocketContext.Provider value={socket}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider forceColorScheme="light">
            <Notifications position="top-right" limit={3} zIndex={1100} />
            <NetworkNotifications />
            <RouterProvider router={router} />
          </MantineProvider>
        </QueryClientProvider>
      </SocketContext.Provider>
      </I18nextProvider>
    </React.StrictMode>
  );
};

export default init;
