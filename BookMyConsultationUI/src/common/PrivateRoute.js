import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!sessionStorage.getItem("accessToken"); // Check if accessToken exists

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" /> // Redirect to login if not authenticated
        )
      }
    />
  );
};

export default PrivateRoute;