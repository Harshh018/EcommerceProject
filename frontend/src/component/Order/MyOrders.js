import React, { Fragment, useEffect } from "react";
import "./MyOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import LaunchIcon from "@material-ui/icons/Launch";
import { deleteMyOrder } from "../../actions/orderAction";

const MyOrders = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, orders } = useSelector(
    (state) => state.myOrders
  );

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);
  const deleteOrderHandler = (id) => {
  if (window.confirm("Are you sure you want to delete this order?")) {
    dispatch(deleteMyOrder(id));
  }
};

  return (
    <Fragment>
      <MetaData title={`${user?.name || "User"}'s Orders`} />

      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">

          <Typography id="myOrdersHeading">
            {user?.name}'s Orders
          </Typography>

          <div className="ordersTable">

            <div className="ordersTableHeader">
              <span>Order ID</span>
              <span>Status</span>
              <span>Items Qty</span>
              <span>Amount</span>
              <span>Actions</span>
            </div>

            {orders && orders.length > 0 ? (
              orders.map((item) => (
                <div className="ordersTableRow" key={item._id}>

  <span className="orderId">
    {item._id}
  </span>

  <span
    className={
      item.orderStatus === "Delivered"
        ? "greenColor"
        : "redColor"
    }
  >
    {item.orderStatus || "Processing"}
  </span>

  <span>
    {item.orderItems
      ? item.orderItems.length
      : 0}
  </span>

  <span>
    ₹{item.totalPrice}
  </span>

  <span>
    <Link to={`/order/${item._id}`}>
      <LaunchIcon />
    </Link>

    <button
      onClick={() => deleteOrderHandler(item._id)}
      className="deleteOrderBtn"
    >
      Delete
    </button>
  </span>

</div>
              ))
            ) : (
              <div className="noOrders">
                No orders found
              </div>
            )}

          </div>

        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;