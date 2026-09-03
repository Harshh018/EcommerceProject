const express=require("express");
const {processPayment}= require("../controllers/paymentControllers");
const router=express.Router();
const{ isAuthenticatedUser}= require("../middleware/auth");
const { sendStripeApiKey } = require("../controllers/paymentControllers");

router.route("/payment/process").post(isAuthenticatedUser,processPayment);

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

module.exports=router;
