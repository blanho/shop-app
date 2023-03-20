import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";

import Sidebar from "./Sidebar";
import { allUsers, clearErrors } from "../../actions/userActions";

const UserList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, users } = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(allUsers());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  const setUsers = () => {
    const data = {
      columns: [
        {
          label: "User ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };
    users.forEach((user) => {
      data.rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        actions: (
          <Fragment>
            <Link
              className="btn btn-primary py-1 px-2"
              to={`/admin/users/${user._id}`}
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button className="btn btn-danger py-1 px-2 ml-2">
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });
    return data;
  };
  return (
    <Fragment>
      <MetaData title={"All Users"} />
      <div className="row">
        <Sidebar />
        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Users</h1>
            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <MDBDataTable
                  data={setUsers()}
                  className="px-3"
                  bordered
                  striped
                  hover
                />
              </Fragment>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default UserList;
