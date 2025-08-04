import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Register from '../Pages/Register/Register';
import Home from '../Pages/Home';
import Dashboard from '../Dashboard/Dashboard';
import Members from '../Dashboard/Members';
import DashboardLayout from '../Dashboard/DashboardLayout';
import AddMeals from '../Dashboard/AddMeals';
import Expenses from '../Dashboard/Expenses';
import InduvitualAmount from '../Dashboard/InduvitualAmount';
import History from '../Dashboard/History';
import MealSheet from '../Dashboard/MealSheet';
import Profile from '../Dashboard/Profile';
import Summary from '../Dashboard/Summary';
import Login from '../Pages/Login/Login';
import ManagerRoute from '../../Manager/ManagerRoute';
import Unauthorized from './UnAuthorize';
import Notice from '../Dashboard/Notice';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home></Home>,
      },
      {
        path: 'register', // '/' বাদ দিয়ে সরাসরি 'register' লিখলে হয়
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login></Login>,
        
      },

      {
        path: 'dashboard',
        element: <DashboardLayout></DashboardLayout>,
        children: [
          {
            path: 'members',
            element: (
              <ManagerRoute>
                <Members></Members>
              </ManagerRoute>
            ),
          },
          {
            index: true,
            element:<ManagerRoute> <Dashboard></Dashboard></ManagerRoute>,
          },
          {
            path: 'addMeals',
            element: (
              <ManagerRoute>
                <AddMeals></AddMeals>
              </ManagerRoute>
            ),
          },
          {
            path: 'expenses',
            element: (
              <ManagerRoute>
                <Expenses></Expenses>
              </ManagerRoute>
            ),
          },
          {
            path: 'induvitualAmount',
            element: (
              <ManagerRoute>
                <InduvitualAmount></InduvitualAmount>
              </ManagerRoute>
            ),
          },
          {
            path: 'history',
            element: (
              <ManagerRoute>
                <History></History>
              </ManagerRoute>
            ),
          },
          {
            path: 'mealsheet',
            element: (
              <ManagerRoute>
                <MealSheet></MealSheet>
              </ManagerRoute>
            ),
          },
          {
            path:'notice',
            element:<ManagerRoute>
              <Notice></Notice>
            </ManagerRoute>

          },
          {
            path: 'summary',
            element: (
              <ManagerRoute>
                <Summary></Summary>
              </ManagerRoute>
            ),
          },
 {
        path: '/dashboard/profile',
        element: <Profile></Profile>,
      },
        ],
      },
     
    ],
  },
  {
    path: '/unauthorized',
    element: <Unauthorized></Unauthorized>,
  },
  ,
  {},
]);

export default router;
