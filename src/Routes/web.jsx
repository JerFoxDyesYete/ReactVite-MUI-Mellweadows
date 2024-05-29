import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Signup from '../Pages/Signup';
import Login from '../Pages/Login';
import Main from '../Pages/Main';
import Dashboard from '../Pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/signup',
    element: <Signup/>
  },
  {
    path: '/dashboard',
    element: <Dashboard/>,
    children: [
        {
            index: true,
            element: <Main />
        },
        {
            path: "users",
            element: <div>Users</div>
        },
        {
            path: "reports",
            element: <div>Reports</div>
        },
        {
            path: "settings",
            element: <div>Settings</div>
        }
    ]
  }
]);

export default router;
