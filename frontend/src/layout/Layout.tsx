import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { authContext } from "../contexts/authContext/authContext";
import UserMenu from "../shared/components/UserMenu/UserMenu";
import logo from "../assets/Black Eyes.png"

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { authenticated, userInfo } = useContext(authContext);
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col min-h-screen justify-center">
      <div className="flex flex-col">
        <div className="fixed inset-x-0 top-0 z-50 h-0.5 mt-0.5"></div>
        {authenticated && !pathname.includes("video") && (
          <nav
            className="flex justify-around py-4 bg-white/80
            backdrop-blur-m font-medium  shadow-md w-full
            fixed top-0 left-0 right-0 z-10"
          >
            <div className="flex items-center">
              <img
                className="object-cover w-40 h-10"
                src={logo}
                alt="Store Logo"
              />
            </div>

            <div className="items-center hidden space-x-8 lg:flex">
              <Link
                to="/users"
                style={{
                  color: pathname === "/users" ? "orange" : "gray",
                }}
                className="flex font-medium cursor-pointer transition-colors duration-300"
              >
                Users
              </Link>

              <Link
                to="/zones"
                style={{
                  color: pathname === "/zones" ? "orange" : "gray",
                }}
                className="flex font-medium cursor-pointer transition-colors duration-300"
              >
                Zones
              </Link>

              <Link
                to="/departments"
                style={{
                  color: pathname === "/departments" ? "orange" : "gray",
                }}
                className="flex font-medium cursor-pointer transition-colors duration-300"
              >
                Departments
              </Link>

              <Link
                to="/access"
                style={{
                  color: pathname === "/access" ? "orange" : "gray",
                }}
                className="flex font-medium cursor-pointer transition-colors duration-300"
              >
                Access Logs
              </Link>
            </div>
            <UserMenu user={userInfo} />
          </nav>
        )}
      </div>
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
