import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Routes,
  Route
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import { AuthProvider } from './contexts/AuthContext/AuthContext';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AuthProvider><RootLayout /></AuthProvider>}>
      <Route index={true} element={<LandingPage />} />
      <Route path="login" element={<Login />} />
    </Route>
  )
);



const Router = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Router