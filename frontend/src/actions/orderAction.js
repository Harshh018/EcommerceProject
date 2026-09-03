

import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/orderConstants";

import axios from "axios";

// Create Order
// actions/orderAction.js
export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({
      type: CREATE_ORDER_REQUEST,
    });

    console.log(
      "PAYLOAD SENT TO BACKEND:",
      order
    );

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/v1/order/new",
      order,
      config
    );

    console.log(
      "ORDER RESPONSE FROM BACKEND:",
      data
    );

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log(
      "CREATE ORDER ERROR:",
      error
    );

    console.log(
      "ERROR RESPONSE:",
      error.response
    );

    dispatch({
      type: CREATE_ORDER_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unable to create order",
    });
  }
};
// My Orders
// My Orders
export const myOrders = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ORDERS_REQUEST });

    console.log("Fetching my orders...");

    const { data } = await axios.get("/api/v1/orders/me");

    console.log("MY ORDERS RESPONSE:", data);

    dispatch({
      type: MY_ORDERS_SUCCESS,
      payload: data.orders,
    });

  } catch (error) {
    console.log("========== MY ORDERS ERROR ==========");
    console.log("Error:", error);
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
    console.log("=====================================");

    dispatch({
      type: MY_ORDERS_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unable to fetch orders",
    });
  }
};

// Get All Orders (Admin)
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDERS_REQUEST });

    const { data } = await axios.get("/api/v1/admin/orders");

    dispatch({ type: ALL_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Order (Admin)
export const updateOrder = (id, order) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(`/api/v1/admin/order/${id}`, order, config);

    dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Order (Admin)
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/order/${id}`);

    dispatch({ type: DELETE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Order Details
export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/order/${id}`);

    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.order });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

export const deleteMyOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });

    const { data } = await axios.delete(`/api/v1/order/${id}`);

    dispatch({
      type: DELETE_ORDER_SUCCESS,
      payload: data.success,
    });

  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unable to delete order",
    });
  }
};