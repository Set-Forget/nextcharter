import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom";

import App from './App.jsx'
import TableView from './pages/TableView.jsx';
import Layout from './pages/Layout.jsx';
import StudentProgress from './pages/StudentProgress.jsx';

import './index.css'

const router = createHashRouter([
  {
    element: <Layout />,
    children: [{
      path: "/",
      element: <App />,
    },
    {
      path: "/registrations",
      element: <TableView />,
    },{
      path: "/student-progress",
      element: <StudentProgress />,
    }]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
