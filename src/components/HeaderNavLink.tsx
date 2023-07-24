import { NavLink } from "react-router-dom"
import { twMerge } from "tailwind-merge"

export type HeaderNavLinkProps = {
  to: string,
  className: string,
  children: string,
  onClick?: (e: any) => void
}


const HeaderNavLink = ({ to, className, children, onClick = function (e) { return } }: HeaderNavLinkProps) => {
  const handleClick = (e: any) => {
    e.preventDefault()
    return onClick(e);
  }

  return (
    <NavLink
      to={to}
      className={twMerge("", className)}
      onClick={handleClick}
    >
      {children}
    </NavLink>
  )
}

export default HeaderNavLink