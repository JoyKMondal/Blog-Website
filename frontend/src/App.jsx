/* eslint-disable no-empty */
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

import Auth from "./pages/auth/Auth";
import AuthRequired from "./pages/auth/AuthRequired";
import HomePage from "./pages/home/HomePage";
import { useHttpClient } from "./shared/hooks/http-hook";

import Layout from "./components/layout/Layout";
import Error from "./shared/components/UIElements/Error";
import NotFound from "./shared/components/UIElements/NotFound";
import "./App.css";
import EditorPage from "./pages/editor/EditorPage";
import SearchPage from "./components/layout/SearchPage";
import UserProfilePage from "./pages/profile/UserProfilePage";
import BlogDetailPage from "./pages/blog/BlogDetailPage";
import SettingsPage from "./pages/settings/SettingsPage";
import EditProfilePage from "./pages/settings/EditProfilePage";
import ChangePasswordPage from "./pages/settings/ChangePasswordPage";
import NotificationPage from "./pages/notification/NotificationPage";
import BlogManagementPage from "./pages/notification/BlogManagementPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <AuthRequired />,
        children: [
          {
            path: "/",
            element: <HomePage />,
            errorElement: <Error />,
          },
          {
            path: "/search/:query",
            element: <SearchPage />,
            errorElement: <Error />,
          },
          {
            path: "/user/:username",
            element: <UserProfilePage />,
            errorElement: <Error />,
          },
          {
            path: "/blog/:blogId",
            element: <BlogDetailPage />,
            errorElement: <Error />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
            children: [
              {
                path: "edit-profile",
                element: <EditProfilePage />,
                errorElement: <Error />,
              },
              {
                path: "change-password",
                element: <ChangePasswordPage />,
                errorElement: <Error />,
              },
            ],
          },
          {
            path: "/dashboard",
            element: <SettingsPage />,
            children: [
              {
                path: "notifications",
                element: <NotificationPage />,
                errorElement: <Error />,
              },
              {
                path: "blogs",
                element: <BlogManagementPage />,
                errorElement: <Error />,
              },
            ],
          },
        ],
      },
      {
        path: "/auth",
        element: <Auth />,
        errorElement: <Error />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  {
    element: <AuthRequired />,
    children: [
      {
        path: "/editor",
        element: <EditorPage />,
        errorElement: <Error />,
      },
      {
        path: "/editor/:blogId",
        element: <EditorPage />,
        errorElement: <Error />,
      },
    ],
  },
]);

function App() {
  const { token, login, logout, userId, loading } = useAuth();
  const [loggedInUser, setLoggedInUser] = useState();

  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/${userId}`
        );

        setLoggedInUser(responseData.user);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, userId]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        loggedInUser: loggedInUser && loggedInUser,
        setLoggedInUser: setLoggedInUser,
        userId: userId,
        loading: loading,
        login: login,
        logout: logout,
      }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
