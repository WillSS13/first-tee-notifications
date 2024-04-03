import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ClassList from './pages/classList';
import Message from './pages/message';
import Unauthorized from './pages/unauthorized';
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
    element: <ClassList />,
  },
  {
    path: "/message",
    element: <Message />,
  },
  {
    path: "/status",
    element: <App />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);