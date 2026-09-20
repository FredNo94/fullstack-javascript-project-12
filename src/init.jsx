import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import store from './store';
import SocketContext from './contexts/SocketContext.js';

const init = async (socket) => {
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
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]);

  return (
    <React.StrictMode>
      <SocketContext.Provider value={socket}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </SocketContext.Provider>
    </React.StrictMode>
  );
};

export default init;
