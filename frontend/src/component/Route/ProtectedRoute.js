

import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

// Fix 1: Added isAdmin prop to the component arguments
const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <Fragment>
      {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated === false) {
              return <Redirect to="/login" />;
            }

            // Fix 2: Added optional chaining (user?.role) to avoid errors before user object loads
            if (isAdmin === true && user?.role !== "admin") {
              return <Redirect to="/login" />;
            }

            return <Component {...props} />;
          }}
        />
      )}
    </Fragment>
  );
};

export default ProtectedRoute;