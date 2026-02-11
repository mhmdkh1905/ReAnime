import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../components/layout/RootLayout";
import Home from "../pages/Home";
import Movie from "../pages/Movie";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "movie", element: <Movie /> },
      { path: "profile", element: <Profile /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default router;
