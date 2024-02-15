import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import React from 'react'
import PaymentStatus from './PaymentStatus'
const stripePromise = loadStripe("pk_test_51LYOZnSED7zxlOa8AeKxrASo8lDN3hHB3MlUnmlJ90mUp6LQw6Y5FRxielPdZYbXe0CqOg7klNprMv0dQcaK3eFd00pcuZRnmI");

const PSwrapper = () => {
  return (
    <Elements stripe={stripePromise}>
        <PaymentStatus/>
    </Elements>
  )
}

export default PSwrapper