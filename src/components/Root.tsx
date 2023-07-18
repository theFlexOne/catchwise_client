import RootLayout from "../layouts/RootLayout"
import { AuthProvider } from "../contexts/AuthContext/AuthContext"
import { Outlet } from "react-router-dom"


const Root = () => {
  return (
    <AuthProvider>
      <RootLayout>
        <Outlet />
      </RootLayout>
    </AuthProvider>
  )
}

export default Root