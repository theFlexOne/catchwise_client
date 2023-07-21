import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Root from "./components/Root";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import MapPage from "./pages/MapPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "map",
        element: <MapPage />,
      },
      {
        path: "home",
        element: <Dashboard />,
      },
    ]
  }
]
);



const Router = () => {



  return (
    <RouterProvider router={router} />
  )
}

export default Router