import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ClassList from './pages/classList';
import Message from './pages/message';
import Unauthorized from './pages/unauthorized';
import Monitor from './pages/monitor';
import ProtectedRoute from './components/ProtectedRoute';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/classList",
    element: (
      <ProtectedRoute>
        <ClassList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/message",
    element: (
      <ProtectedRoute>
        <Message />
      </ProtectedRoute>
    ),
  },
  {
    path: "/monitor",
    element: (
      <ProtectedRoute>
        <Monitor />
      </ProtectedRoute>
    ),
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);
