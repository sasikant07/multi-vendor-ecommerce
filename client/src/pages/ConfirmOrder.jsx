import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import error from "../assets/error.png";
import success from "../assets/success.png";

const load = async () => {
  return await loadStripe(
    "pk_test_51OTQNfCbH4s1f9nVWIcLF06xmYStFIo3Op12hDBA8wJO4YY5rgYFjiJ4PdK0Q5aealO2F9OHcFTCiEe0x75Ldgx40040Y1Ukj1"
  );
};
const ConfirmOrder = () => {
  const [loader, setLoader] = useState(true);
  const [stripe, setStripe] = useState("");
  const [message, setMessage] = useState(null);

  const get_load = async () => {
    const tempStripe = await load();
    setStripe(tempStripe);
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) {
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("succeeded");
          break;
        case "processing":
          setMessage("processing");
          break;
        case "requires_payment_method":
          setMessage("failed");
          break;
        default:
          setMessage("failed");
      }
    });
  }, [stripe]);

  useEffect(() => {
    get_load();
  }, []);

  const update_payment = async () => {
    const orderId = localStorage.getItem("orderId");

    if (orderId) {
      try {
        await axios.get(`http://localhost:8080/api/order/confirm/${orderId}`);
        localStorage.removeItem("orderId");
        setLoader(false);
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };

  useEffect(() => {
    if (message === "succeeded") {
      update_payment();
    }
  }, [message]);

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-4">
      {message === "failed" || message === "processing" ? (
        <>
          <img src={error} alt="error" />
          <Link
            to="/dashboard/my-orders"
            className="px-5 py-2 bg-green-500 rounded-sm text-white"
          >
            Back to My Orders
          </Link>
        </>
      ) : message === "succeeded" ? (
        loader ? (
          <FadeLoader />
        ) : (
          <>
            <img src={success} alt="error" />
            <Link
              to="/dashboard/my-orders"
              className="px-5 py-2 bg-green-500 rounded-sm text-white"
            >
              Back to My Orders
            </Link>
          </>
        )
      ) : (
        <FadeLoader />
      )}
    </div>
  );
};

export default ConfirmOrder;
