import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";  // Import prop-types for prop validation

function CheckAuth({ isAuthenticated, user, children }) {
    const location = useLocation();

    if (location.pathname === "/") {
        if (!isAuthenticated) {
          return <Navigate to="/auth/login" />;
        } else {
          if (user?.role === "admin") {
            return <Navigate to="/admin/dashboard" />;
          } else {
            return <Navigate to="/shop/home" />;
          }
        }
      }

    if (
        !isAuthenticated &&
        !(
          location.pathname.includes("/login") ||
          location.pathname.includes("/register")
        )
      ) {
        return <Navigate to="/auth/login" />;
      }

    if (
        isAuthenticated &&
        (location.pathname.includes("/login") ||
          location.pathname.includes("/register"))
      ) {
        if (user?.role === "admin") {
          return <Navigate to="/admin/dashboard" />;
        } else {
          return <Navigate to="/shop/home" />;
        }
      }
    
    if (isAuthenticated && user?.role !== 'admin' && location.pathname.includes('admin')) {
        return <Navigate to="/unauth-page" />;
    }

    if (isAuthenticated && user?.role === 'admin' && location.pathname.includes('shop')) {
        return <Navigate to="/admin/dashboard" />;
    }

    return <>{children}</>;
}

// Add prop-types validation for the component's props
CheckAuth.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,    // isAuthenticated must be a boolean
    user: PropTypes.shape({
        role: PropTypes.string                     // user.role must be a string
    }),
    children: PropTypes.node                      // children can be any renderable content (node)
};

export default CheckAuth;
