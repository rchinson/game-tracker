import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Games from '../components/Games';
import UserProfile from '../components/UserProfile';
import UserProfileEdit from '../components/UserProfileEdit/UserProfileEdit';
import Screenshots from '../components/Screenshots';
import Reviews from '../components/Reviews';
import UserGameLibrary from '../components/UserGameLibrary/UserGameLibrary';
import GameDetails from '../components/GameDetails';


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },



      {
        path: "/users/:userId",
        element: <UserProfile />,
      },

      {
        path: "/users/:userId/edit",
        element: <UserProfileEdit />,
      },

      {
        path: "/:userId/games",
        element: <UserGameLibrary />,
      },




      {
        path: "/games",
        element: <Games />,
      },
      {
        path: "/games/:gameId",
        element: <GameDetails />,
      },

      



      {
        path: "/screenshots",
        element: <Screenshots />,
      },






      {
        path: "/reviews",
        element: <Reviews />,
      },





    ],
  },
]);