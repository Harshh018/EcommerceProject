import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Sidebar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";

const UsersList = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, users } = useSelector((state) => state.allUsers || {});
  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile || {});

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success(message || "User Deleted Successfully");
      history.push("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, history, isDeleted, message]);

  const columns = [
    { 
      field: "id", 
      headerName: "User ID", 
      minWidth: 220, 
      flex: 0.8 
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 120,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon style={{ color: "rgba(0, 0, 0, 0.527)", cursor: "pointer" }} />
            </Link>

            <Button
              style={{ minWidth: "auto", padding: 0 }}
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon style={{ color: "rgba(0, 0, 0, 0.527)", cursor: "pointer" }} />
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title="ALL USERS - Admin" />

      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;