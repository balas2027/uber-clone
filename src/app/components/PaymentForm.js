// components/PaymentForm.js
"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ rideRequest, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rideRequestId: rideRequest.id,
        }),
      });

      const { clientSecret, paymentIntentId, error: apiError } = await response.json();

      if (apiError) {
        setError(apiError);
        setProcessing(false);
        return;
      }

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: rideRequest.user_name,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Confirm payment with backend
        const confirmResponse = await fetch("/api/payments/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            rideRequestId: rideRequest.id,
          }),
        });

        const confirmResult = await confirmResponse.json();

        if (confirmResult.success) {
          onPaymentSuccess(paymentIntent);
        } else {
          setError(confirmResult.error || "Payment confirmation failed");
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred during payment");
    }

    setProcessing(false);
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg">
        <CardElement options={cardStyle} />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          processing
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {processing ? "Processing..." : `Pay ₹${rideRequest.price}`}
      </button>
    </form>
  );
};

const PaymentModal = ({ rideRequest, isOpen, onClose, onPaymentSuccess }) => {
  if (!isOpen || !rideRequest) return null;

  const handlePaymentSuccess = (paymentIntent) => {
    onPaymentSuccess(paymentIntent);
    onClose();
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
  };

  return (
    <div className="w-full  bg-black bg-opacity-50 flex items-center  justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Ride Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>From:</strong> {rideRequest.pickup_location}</p>
            <p><strong>To:</strong> {rideRequest.dropoff_location}</p>
            <p><strong>Distance:</strong> {rideRequest.distance} km</p>
            <p><strong>Amount:</strong> ₹{rideRequest.price}</p>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            rideRequest={rideRequest}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;