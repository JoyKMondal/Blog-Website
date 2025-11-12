/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import axios from "axios";

const SettingsPage = () => {
  const [pageState, setPageState] = useState(null);
  const routes = [
    <i className="fi fi-br-bars-staggered"></i>,
    pageState || "Dashboard",
  ];

  const {
    token,
    isLoggedIn,
    loggedInUser,
    loggedInUser: { newNotification },
    setLoggedInUser,
  } = useContext(AuthContext);

  const stateRef = useRef();

  const [navIndex, setNavIndex] = useState(0);
  const [showSideNav, setShowSideNav] = useState(false);

  const changeNavigation = (index) => {
    if (index === 0) {
      setNavIndex(0);
      setShowSideNav(true);
    } else {
      setNavIndex(1);
      setShowSideNav(false);
    }
  };

  useEffect(() => {
    setShowSideNav(false);
    stateRef.current.click();
  }, [pageState]);

  useEffect(() => {
    const checkNewNotifications = async () => {
      if (isLoggedIn) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_REACT_APP_BACKEND_URL
            }/api/users/is-new-notification`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            setLoggedInUser({
              ...loggedInUser,
              newNotification: response.data.newNotification,
            });
          }
        } catch (err) {
          console.error("Error checking notifications:", err);
        }
      }
    };

    checkNewNotifications();
  }, [token]);

  return (
    <div className="dashboard-sidebar flex justify-center max-md:flex-col gap-10 relative">
      <Toaster />
      <div className="w-full md:w-1/3 lg:w-1/4 border h-cover md:sticky">
        <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto transition-all duration-200 md:hidden max-md:sticky top-[80px]">
          {routes.map((route, index) => {
            return (
              <button
                onClick={() => changeNavigation(index)}
                key={index}
                ref={index === 1 ? stateRef : null}
                className={`p-4 px-6 capitalize ${
                  navIndex === index
                    ? "text-black border-b-2  border-dark-grey"
                    : "text-dark-grey"
                }`}
              >
                {route}
              </button>
            );
          })}
        </div>

        <div
          className={`overflow-y-auto p-5 md:pr-0 ${
            showSideNav ? "max-md:block" : "max-md:hidden"
          }`}
        >
          <h1 className="text-2x1 text-dark-grey mb-3">Dashboard</h1>
          <hr className="border-grey -m1-6 mb-8 mr-6" />

          <NavLink
            className="dashboard-link"
            to="/dashboard/blogs"
            onClick={(e) => setPageState(e.target.innerText)}
          >
            <i className="fi fi-rr-blog-pencil"></i>
            Blogs
          </NavLink>

          <NavLink
            className="dashboard-link"
            to="/dashboard/notifications"
            onClick={(e) => setPageState(e.target.innerText)}
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {newNotification ? (
                <span className="badge badge-xs badge-primary indicator-item"></span>
              ) : (
                ""
              )}
            </div>
            Notifications
          </NavLink>

          <NavLink
            className="dashboard-link"
            to="/editor"
            onClick={(e) => setPageState(e.target.innerText)}
          >
            <i className="fi fi-rr-file-edit"></i>
            Write
          </NavLink>
        </div>

        <div
          className={`overflow-y-auto p-5 md:pr-0 ${
            showSideNav ? "max-md:block" : "max-md:hidden"
          }`}
        >
          <h1 className="text-2x1 text-dark-grey mb-3">Settings</h1>
          <hr className="border-grey -m1-6 mb-8 mr-6" />

          <NavLink
            className="sidebar-link"
            to="/settings/edit-profile"
            onClick={(e) => setPageState(e.target.innerText)}
          >
            <i className="fi fi-rr-blog-pencil"></i>
            Edit Profile
          </NavLink>

          <NavLink
            className="sidebar-link"
            to="/settings/change-password"
            onClick={(e) => setPageState(e.target.innerText)}
          >
            <i className="fi fi-rr-bell"></i>
            Change Password
          </NavLink>
        </div>

        <div
          className={`overflow-y-auto p-5 md:hidden md:pr-0 ${
            !showSideNav ? "show" : "hide"
          }`}
        >
          <Outlet />
        </div>
      </div>

      <div className="w-full md:w-2/3 lg:w-3/4 mx-auto border hidden md:block px-10">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;
