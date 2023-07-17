import { NavLink } from "react-router-dom"

const LoginNavLink = () => {
  return (
    <NavLink
      to="/login"
      className=""
      state={{ from: window.location.pathname }}
    >
      Login
    </NavLink>
  )
}

export default LoginNavLink