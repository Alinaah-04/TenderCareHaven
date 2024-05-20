// index.js
const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_BtUUC',
  key_secret: 'wXchHKo0R9bYYt7X0tzCUQBL'
});

// Create an order
app.post('/create-order', async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;
  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency,
      receipt,
      notes
    };
    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Verify payment signature
app.post('/verify-payment', (req, res) => {
  const { order_id, payment_id, signature } = req.body;
  const generated_signature = crypto
    .createHmac('sha256', 'YOUR_KEY_SECRET')
    .update(order_id + '|' + payment_id)
    .digest('hex');

  if (generated_signature === signature) {
    res.status(200).send('Payment verified successfully');
  } else {
    res.status(400).send('Payment verification failed');
  }
});

// Start the server
app.listen(port, () => {
  console.log('Server is running on http://localhost:3000');
});
