import { useState } from "react";
import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";


// Payment Form Component
const CheckoutForm = ({ clientSecret, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!stripe || !elements) {
        return;
      }
  
      setLoading(true);
      setError(null);
  
      const cardElement = elements.getElement(CardElement);
  
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // You can add billing details here if needed
          },
        },
      });
  
      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (paymentIntent.status === "succeeded") {
        setLoading(false);
        onSuccess(paymentIntent);
      } else {
        setError("Payment processing failed. Please try again.");
        setLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-gray-300 p-3 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
  
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
  
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 rounded-md text-center font-medium cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={!stripe || loading}
            className="flex-1 py-3 px-4 bg-pink-600 hover:bg-pink-700 transition duration-200 text-white rounded-md text-center font-medium cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </form>
    );
  };


export default CheckoutForm;