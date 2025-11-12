import { useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

export default function AuthRequired() {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/auth"
        state={{ message: "You must log in first", from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}
