import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
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
                <Link to="/users">Users</Link>
              </li>
              <li>
                <Link to="/zones">Zones</Link>
              </li>
              <li>
                <Link to="/departments">Departments</Link>
              </li>
              <li>
                <Link to="/access">AccessLog</Link>
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
