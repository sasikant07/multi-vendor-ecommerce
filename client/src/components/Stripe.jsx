import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";
const stripePromise = loadStripe(
  "pk_test_51OTQNfCbH4s1f9nVWIcLF06xmYStFIo3Op12hDBA8wJO4YY5rgYFjiJ4PdK0Q5aealO2F9OHcFTCiEe0x75Ldgx40040Y1Ukj1"
);
const Stripe = ({ price, orderId }) => {
  const [clientSecret, setClientSecret] = useState("");

  const appearance = {
    theme: "stripe",
  };

  const options = {
    appearance,
    clientSecret,
  };

  const create_payment = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/order/create-payment",
        { price },
        { withCredentials: true }
      );
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return (
    <div className="mt-4">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm orderId={orderId} />
        </Elements>
      ) : (
        <button
          onClick={create_payment}
          className="px-10 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-white"
        >
          Start Payment
        </button>
      )}
    </div>
  );
};

export default Stripe;
