import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/LogIn";
import Root from "./components/Root";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import MapPage from "./pages/MapPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" />,
      },
      {
        path: "home",
        element: <Landing />,
      },
      {
        path: "map",
        element: <MapPage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ]
  },

]
);



const Router = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Router