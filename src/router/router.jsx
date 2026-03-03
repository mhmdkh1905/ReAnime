import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../components/layout/rootLayout/RootLayout";
import Home from "../pages/home/Home";
import Movie from "../pages/movie/Movie";
import Login from "../pages/login-register/Login";
import Register from "../pages/login-register/Register";
import ForgetPassword from "../pages/forgetPassword/ForgetPassword";
import Profile from "../pages/profile/Profile";
import Admin from "../pages/admin/Admin";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "movie/:id", element: <Movie /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);
export default router;
