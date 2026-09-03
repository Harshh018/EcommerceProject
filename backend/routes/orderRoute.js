const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

// Create new order
router.route("/order/new").post(isAuthenticatedUser, newOrder);

// User's own orders (placed BEFORE /order/:id so Express doesn't match "me" as an :id)
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// Single order details (Allowed for logged-in users so they can view their own order details)
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router
  .route("/order/:id")
  .delete(isAuthenticatedUser, deleteOrder);
// Admin routes
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder); // Fixed syntax here

module.exports = router;