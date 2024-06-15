import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Signup from '../Pages/Signup';
import Login from '../Pages/Login';
import Main from '../Pages/Main';
import Dashboard from '../Pages/Dashboard';
import Patient from '../Components/Patient';
import Staff from '../Components/Staff';
import Ward from '../Components/Ward';
import Supply from '../Components/Supply';
import PatientMain from '../Components/PatientMain';
import WebPage from '../Pages/WebPage';
import AddSupply from '../Components/AddSupply';
import MedicationForm from '../Components/MedicationForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <WebPage/>
  },
  {
    path: '/login',
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
            path: "patients",
            element: <Patient/>
        },
        {
          path: 'patientsmain',
          element: <PatientMain/>
        },
        {
          path: 'patientmedication',
          element: <MedicationForm/>
        },
        {
            path: "staff",
            element: <Staff/>
        },
        {
            path: "ward",
            element: <Ward/>
        },
        {
            path: "supply",
            element: <AddSupply/>
        },
        {
            path: "supplylist",
            element: <Supply/>
        }
    ]
  }
]);

export default router;
