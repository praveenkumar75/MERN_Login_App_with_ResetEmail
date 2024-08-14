import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import PageNotFound from './pages/Login/PageNotFound';
import Password from './pages/Login/Password';
import Profile from './pages/Login/Profile';
import Recovery from './pages/Login/Recovery';
import Register from './pages/Login/Register';
import Reset from './pages/Login/Reset';
import UserName from './pages/Login/UserName';
import { AuthorizeUser, ProtectRoute } from './middleware/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserName />
  },
  {
    path: '/profile',
    element: <AuthorizeUser><Profile /></AuthorizeUser>
  },
  {
    path: '/recovery',
    element: <Recovery />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/reset',
    element: <Reset />
  },
  {
    path: '/password',
    element: <ProtectRoute><Password /></ProtectRoute>
  },
  {
    path: '*',
    element: <PageNotFound />
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
