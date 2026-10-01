import { createAuthStore } from './authStore';
import { createUiStore } from './uiStore';
import StoresContext from './contexts/StoresContext';
import AppLifecycle from './components/AppLifecycle';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import createI18n from './i18n.js';
import { MantineProvider } from '@mantine/core';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications, createNotificationsStore } from '@mantine/notifications';
import { isAxiosError } from 'axios';
import { showRequestError, showNetworkError } from './toasts';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import App from './App.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppApiContext from './contexts/AppApiContext.js';
import createRealtimeApi from './services/realtimeApi.js';
import createAppApi from './services/appApi.js';

const init = async (socket) => {
  const i18n = await createI18n();
  document.title = i18n.t('app.name');
  const stores = { auth: createAuthStore(), ui: createUiStore(), toasts: createNotificationsStore() };
  const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: (error) => showRequestError(error, i18n.t.bind(i18n), stores.toasts) }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isAxiosError(error) && !error.response) showNetworkError(i18n.t.bind(i18n), stores.toasts);
      },
    }),
  });
  const api = createAppApi({
    realtime: createRealtimeApi(socket), stores, queryClient, t: i18n.t.bind(i18n),
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
      <StoresContext.Provider value={stores}>
      <AppApiContext.Provider value={api}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider forceColorScheme="light">
            <AppLifecycle />
            <Notifications store={stores.toasts} position="bottom-right" limit={3} zIndex={1100} />
            <RouterProvider router={router} />
          </MantineProvider>
        </QueryClientProvider>
      </AppApiContext.Provider>
      </StoresContext.Provider>
      </I18nextProvider>
    </React.StrictMode>
  );
};

export default init;
