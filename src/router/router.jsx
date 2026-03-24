import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../components/layout/rootLayout/RootLayout";
import Home from "../pages/home/Home";
import Movie from "../pages/movie/Movie";
import Login from "../pages/login-register/Login";
import Register from "../pages/login-register/Register";
import ForgetPassword from "../pages/forgetPassword/ForgetPassword";
import Profile from "../pages/profile/Profile";
import Admin from "../pages/admin/Admin";
//Router definition is readable and simple.
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
  //`/admin` should ideally use a route guard like `<ProtectedRoute requireRole="admin" />`.
  {
    path: "/admin",
    element: <Admin />,
  },
]);
export default router;

// There is no catch-all `*` route / 404 page. In production apps, missing routes should render a not-found page, not a blank or broken screen.
