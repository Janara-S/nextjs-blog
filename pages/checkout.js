import React from "react";
import Stripe from "stripe";
import { parseCookies, setCookie } from "nookies";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe("pk_test_51LFu3uKkNxoRgMbFpHKNY7LBbRiAKrqL1ZxyPoU2BmkkpFQiJF0aFQWi6IgHRxaCKFJbeKa49VhHmpgy7pmpb7Sm00AXcaVxO7");

export const getServerSideProps = async ctx => {
  const stripe = new Stripe("sk_test_51LFu3uKkNxoRgMbFLuQi1vLl2JqWXAPxKv2Xusz23aqd6Ma42dXsVq182PflSVSXnBpC9bDIdz5RcZ5K3pUDMt6u00Q4YP0wpm");

  let paymentIntent;

  const { paymentIntentId } = await parseCookies(ctx);

  if (paymentIntentId) {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      props: {
        paymentIntent
      }
    };
  }

  paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "gbp"
  });

  setCookie(ctx, "paymentIntentId", paymentIntent.id);

  return {
    props: {
      paymentIntent
    }
  };
};

const CheckoutPage = ({ paymentIntent }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm paymentIntent={paymentIntent} />
  </Elements>
);

export default CheckoutPage;