import React, { Fragment, useEffect, useRef, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./Payment.css";

import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

import { createOrder, clearErrors } from "../../actions/orderAction";

const Payment = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const stripe = useStripe();
  const elements = useElements();

  const payBtn = useRef(null);

  const [processing, setProcessing] = useState(false);

  const paymentInProgress = useRef(false);

  const { shippingInfo, cartItems } = useSelector(
    (state) => state.cart
  );

  const { user } = useSelector(
    (state) => state.user
  );

  const { error, success } = useSelector(
    (state) => state.newOrder
  );

  const orderInfoString =
    sessionStorage.getItem("orderInfo");

  const orderInfo = orderInfoString
    ? JSON.parse(orderInfoString)
    : null;

  const paymentData = {
    amount: orderInfo
      ? Math.round(orderInfo.totalPrice * 100)
      : 0,
  };

  const stripeElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily:
          '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSmoothing: "antialiased",

        "::placeholder": {
          color: "#aab7c4",
        },
      },

      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log("PAY BUTTON CLICKED");

    if (paymentInProgress.current) {
      console.log(
        "Payment already in progress..."
      );
      return;
    }

    paymentInProgress.current = true;
    setProcessing(true);

    if (payBtn.current) {
      payBtn.current.disabled = true;
    }

    if (!stripe || !elements) {
      paymentInProgress.current = false;
      setProcessing(false);

      if (payBtn.current) {
        payBtn.current.disabled = false;
      }

      alert.error(
        "Stripe is not loaded yet. Please wait."
      );

      return;
    }

    if (!orderInfo) {
      paymentInProgress.current = false;
      setProcessing(false);

      if (payBtn.current) {
        payBtn.current.disabled = false;
      }

      alert.error(
        "Order information is missing."
      );

      return;
    }

    const localShippingInfo =
      JSON.parse(
        localStorage.getItem("shippingInfo")
      ) || {};

    const activeAddress =
      shippingInfo?.address ||
      localShippingInfo?.address;

    const activeCity =
      shippingInfo?.city ||
      localShippingInfo?.city;

    const activeState =
      shippingInfo?.state ||
      localShippingInfo?.state;

    const activeCountry =
      shippingInfo?.country ||
      localShippingInfo?.country;

    const activePinCode =
      shippingInfo?.pinCode ||
      shippingInfo?.pincode ||
      localShippingInfo?.pinCode ||
      localShippingInfo?.pincode;

    const activePhoneNo =
      shippingInfo?.phoneNo ||
      localShippingInfo?.phoneNo;

    if (
      !activeAddress ||
      !activeCity ||
      !activeState ||
      !activeCountry ||
      !activePinCode ||
      !activePhoneNo
    ) {
      paymentInProgress.current = false;
      setProcessing(false);

      if (payBtn.current) {
        payBtn.current.disabled = false;
      }

      alert.error(
        "Shipping details are incomplete. Please return to the Shipping page."
      );

      return;
    }

    const order = {
      shippingInfo: {
        address: activeAddress,
        city: activeCity,
        state: activeState,
        country: activeCountry,
        pinCode: Number(activePinCode),
        phoneNo: Number(activePhoneNo),
      },

      orderItems: cartItems,

      itemsPrice: orderInfo.subtotal,

      taxPrice: orderInfo.tax,

      shippingPrice:
        orderInfo.shippingCharges,

      totalPrice:
        orderInfo.totalPrice,
    };

    console.log(
      "ORDER BEFORE PAYMENT:",
      JSON.stringify(order, null, 2)
    );

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      console.log(
        "Creating Stripe payment..."
      );

      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      console.log(
        "STRIPE PAYMENT RESPONSE:",
        data
      );
      

      const client_secret =
        data.client_secret;

      if (!client_secret) {
        throw new Error(
          "Stripe client secret was not received from server."
        );
      }

      const cardElement =
        elements.getElement(
          CardNumberElement
        );

      if (!cardElement) {
        throw new Error(
          "Card information is not ready."
        );
      }

      console.log(
        "Confirming Stripe payment..."
      );

      const result =
        await stripe.confirmCardPayment(
          client_secret,
          {
            payment_method: {
              card: cardElement,

              billing_details: {
                name: user?.name || "",
                email: user?.email || "",

                address: {
                  line1: activeAddress,
                  city: activeCity,
                  state: activeState,
                  postal_code:
                    String(activePinCode),
                  country: activeCountry,
                },
              },
            },
          }
        );

      console.log(
        "STRIPE RESULT:",
        result
      );

      if (result.error) {
        console.log(
          "STRIPE ERROR:",
          result.error
        );

        paymentInProgress.current = false;
        setProcessing(false);

        if (payBtn.current) {
          payBtn.current.disabled = false;
        }

        alert.error(
          result.error.message ||
            "Payment failed."
        );

        return;
      }

      if (
        result.paymentIntent &&
        result.paymentIntent.status ===
          "succeeded"
      ) {
        console.log(
          "PAYMENT SUCCESSFUL!"
        );

        order.paymentInfo = {
          id: result.paymentIntent.id,
          status:
            result.paymentIntent.status,
        };

        order.paidAt = Date.now();

        console.log(
          "FINAL ORDER:",
          JSON.stringify(
            order,
            null,
            2
          )
        );

        console.log(
          "Sending order to backend..."
        );

        dispatch(
          createOrder(order)
        );
      } else {
        throw new Error(
          "There is an issue while processing payment."
        );
      }
    } catch (err) {
      console.log(
        "PAYMENT CATCH ERROR:",
        err
      );

      paymentInProgress.current = false;
      setProcessing(false);

      if (payBtn.current) {
        payBtn.current.disabled = false;
      }

      alert.error(
        err.response?.data?.message ||
          err.message ||
          "Payment failed."
      );
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);

      dispatch(clearErrors());

      paymentInProgress.current = false;
      setProcessing(false);

      if (payBtn.current) {
        payBtn.current.disabled = false;
      }
    }

    if (success) {
      console.log(
        "ORDER CREATED SUCCESSFULLY"
      );

      history.push("/success");
    }
  }, [
    dispatch,
    error,
    alert,
    success,
    history,
  ]);

  return (
    <Fragment>

      <MetaData title="Payment" />

      <CheckoutSteps activeStep={2} />

      <div className="paymentContainer">

        <form
          className="paymentForm"
          onSubmit={submitHandler}
        >

          {/* CARD NUMBER */}

          <Typography className="paymentLabel">
            <CreditCardIcon />
            Card Number
          </Typography>

          <div className="stripeInput">
            <CardNumberElement
              options={stripeElementOptions}
            />
          </div>


          {/* EXPIRY DATE */}

          <Typography className="paymentLabel">
            <EventIcon />
            Expiry Date
          </Typography>

          <div className="stripeInput">
            <CardExpiryElement
              options={stripeElementOptions}
            />
          </div>


          {/* CVC */}

          <Typography className="paymentLabel">
            <VpnKeyIcon />
            CVC
          </Typography>

          <div className="stripeInput">
            <CardCvcElement
              options={stripeElementOptions}
            />
          </div>


          {/* PAY BUTTON */}

          <button
            ref={payBtn}
            type="submit"
            className="paymentFormBtn"
            disabled={
              processing ||
              !stripe ||
              !elements
            }
          >
            {processing
              ? "Processing Payment..."
              : orderInfo
              ? `Pay - ₹${orderInfo.totalPrice}`
              : "Pay"}
          </button>

        </form>

      </div>

    </Fragment>
  );
};

export default Payment;