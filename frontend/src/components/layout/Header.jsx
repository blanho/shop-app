import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import Search from "./Search";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userActions";
const Header = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
  };

  const { user, loading } = useSelector((state) => state.auth);
  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <a href="/">
              <img src="./images/logo.png" alt="" />
            </a>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Search />
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <a href="/cart" style={{ textDecoration: "none" }}>
            <span id="cart" className="ml-3">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              2
            </span>
          </a>
          {user ? (
            <div className="ml-4 dropdown d-inline">
              <a
                href="!#"
                className="btn dropdown-toggle text-white"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={user.avatar && user.avatar.url}
                    alt={user && user.name}
                    className="rounded-circle"
                  />
                </figure>
                <span>{user && user.name}</span>
              </a>
              <div
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                {user && user.role !== "admin" ? (
                  <a className="dropdown-item text-danger" href="/orders/me">
                    Orders
                  </a>
                ) : (
                  <a className="dropdown-item text-danger" href="/dashboard">
                    Dashboard
                  </a>
                )}
                <a className="dropdown-item text-danger" href="/me">
                  Profile
                </a>
                <a
                  className="dropdown-item text-danger"
                  href="/"
                  onClick={logoutHandler}
                >
                  Logout
                </a>
              </div>
            </div>
          ) : (
            !loading && (
              <a href="/login" className="btn ml-4" id="login_btn">
                Login
              </a>
            )
          )}
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;
