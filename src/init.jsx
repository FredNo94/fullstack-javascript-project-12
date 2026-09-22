import React from 'react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@mantine/core/styles.css';
import App from './App.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import SocketContext from './contexts/SocketContext.js';

const init = async (socket) => {
  const queryClient = new QueryClient();
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
      <SocketContext.Provider value={socket}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider forceColorScheme="light">
            <RouterProvider router={router} />
          </MantineProvider>
        </QueryClientProvider>
      </SocketContext.Provider>
    </React.StrictMode>
  );
};

export default init;
