import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

const Navbar = () => {
  const { isLoggedIn, logout, loggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSearchEvent = (e) => {
    const value = e.target.value;
    if (e.keyCode === 13 && value.length) {
      navigate(`/search/${value}`);
      e.target.value = "";
    }
  };

  return (
    <div className="navbar bg-base-100 z-100">
      <div className="navbar-start">
        <Link className="btn btn-ghost text-xl">Blog App</Link>
        <label className="input input-bordered flex items-center gap-2 w-11/12 md:w-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            onKeyDown={handleSearchEvent}
            className="grow"
            placeholder="Search"
          />
        </label>
      </div>
      <div className="navbar-end gap-5">
        {isLoggedIn && (
          <Link to="/editor" className="btn text-xl hide md:show">
            <i className="fi fi-rr-file-edit"></i>
            <span>Write</span>
          </Link>
        )}
        {!isLoggedIn && (
          <>
            <Link to="/auth?mode=sign-in" className="btn text-xl hide md:show">
              <i className="fi fi-br-enter"></i>
              <span>Sign In</span>
            </Link>
            <Link to="/auth?mode=sign-up" className="btn text-xl hide md:show">
              <i className="fi fi-tr-sign-up"></i>
              <span>Sign Up</span>
            </Link>
          </>
        )}
        <Link
          to="/dashboard/notifications"
          className="btn btn-ghost btn-circle"
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
            {isLoggedIn && loggedInUser?.newNotification ? (
              <span className="badge badge-xs badge-primary indicator-item"></span>
            ) : (
              ""
            )}
          </div>
        </Link>

        {isLoggedIn && (
          <div className="dropdown dropdown-end z-50">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={loggedInUser?.personal_info.profileImage}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link
                  to="/editor"
                  className="p-4 px-6 text-xl hidden max-md:flex"
                >
                  <i className="fi fi-rr-file-edit"></i>
                  <span>Write</span>
                </Link>
                <Link
                  to={`/user/${loggedInUser?.personal_info.username}`}
                  className="p-4 px-6 text-xl"
                >
                  <i className="fi fi-rr-user"></i>
                  <sapn>Profile</sapn>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/blogs" className="p-4 px-6 text-xl">
                  <i className="fi fi-rr-dashboard-monitor"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/settings/edit-profile" className="p-4 px-6 text-xl">
                  <i className="fi fi-rr-settings"></i>
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <Link onClick={() => logout()} className="p-4 px-6 text-xl">
                  <i className="fi fi-br-exit"></i>
                  <span>Sign Out</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
