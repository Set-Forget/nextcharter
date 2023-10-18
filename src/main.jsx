import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App.jsx'
import TableView from './pages/TableView.jsx';
import Layout from './pages/Layout.jsx';

import './index.css'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [{
      path: "/nextcharter/",
      element: <App />,
    },
    {
      path: "/nextcharter/dashboard",
      element: <TableView />,
    }]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
