import React, { useEffect, useState } from "react";
import axios from "axios";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Payment from "./Payment";

const PaymentWrapper = (props) => {
  const [stripeApiKey, setStripeApiKey] = useState(null);

  useEffect(() => {
    const getStripeApiKey = async () => {
      try {
        const { data } = await axios.get("/api/v1/stripeapikey");

        console.log("Stripe API Key:", data.stripeApiKey);

        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        console.log(
          "Stripe API Key Error:",
          error.response?.data?.message || error.message
        );
      }
    };

    getStripeApiKey();
  }, []);

  if (!stripeApiKey) {
    return <div>Loading payment...</div>;
  }

  return (
    <StripeElements
      stripeApiKey={stripeApiKey}
      props={props}
    />
  );
};

const StripeElements = ({ stripeApiKey, props }) => {
  const stripePromise = React.useMemo(
    () => loadStripe(stripeApiKey),
    [stripeApiKey]
  );

  return (
    <Elements stripe={stripePromise}>
      <Payment {...props} />
    </Elements>
  );
};

export default PaymentWrapper;