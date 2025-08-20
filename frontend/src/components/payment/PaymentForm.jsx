import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/stripe-react-js';
import { Button, Box, Typography, Alert } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

const AnimatedBox = animated(Box);

const PaymentForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      const { paymentIntent } = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      }).then(res => res.json());

      const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    }

    setProcessing(false);
  };

  return (
    <AnimatedBox style={fadeIn} sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <CardElement options={{
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
          }} />
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || processing}
          fullWidth
        >
          {processing ? 'Processing...' : `Pay $${amount / 100}`}
        </Button>
      </form>
    </AnimatedBox>
  );
};

export default PaymentForm;
