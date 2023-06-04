import React, { useContext } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { authContext } from "../contexts/authContext/authContext";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { logout, authenticated } = useContext(authContext);
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      {authenticated && !pathname.includes("video") && (
        <nav>
          <ul className="flex p-2 justify-between">
            <div className="flex gap-3">
              <li>
                <NavLink to="/users" className={({isActive})=>isActive && "text-indigo-600" || "hover:text-indigo-600"}>Users</NavLink>
              </li>
              <li>
                <NavLink to="/zones" className={({ isActive }) => isActive && "text-indigo-600" || "hover:text-indigo-600"}>Zones</NavLink>
              </li>
              <li>
                <NavLink to="/departments" className={({isActive})=>isActive && "text-indigo-600" || "hover:text-indigo-600"}>Departments</NavLink>
              </li>
              <li>
                <NavLink to="/access" className={({ isActive }) => isActive && "text-indigo-600" || "hover:text-indigo-600"}>Access Logs</NavLink>
              </li>
            </div>
            <li>
              <button className="text-red-500" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
