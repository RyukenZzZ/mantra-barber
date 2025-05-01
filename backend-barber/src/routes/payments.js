// src/routes/tripay.js

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY;
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY;
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE;
const TRIPAY_API_URL = 'https://tripay.co.id/api/transaction/create'; // endpoint Tripay

router.post('/create-payment', async (req, res) => {
  try {
    const { booking_id, booking_code, amount, method } = req.body;

    if (!booking_id || !booking_code || !amount || !method) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const payload = {
      method: method, // Misal: QRIS, BCA, PERMATA dll
      merchant_ref: booking_code, 
      amount: amount,
      customer_name: 'Test Customer', // Boleh kamu ambil dari user
      customer_email: 'test@example.com',
      customer_phone: '081234567890',
      order_items: [
        {
          sku: 'SERVICE-001',
          name: 'Booking Service Barber',
          price: amount,
          quantity: 1,
        }
      ],
      callback_url: 'https://your-ngrok-url.ngrok.io/api/tripay/callback',
      return_url: 'https://your-ngrok-url.ngrok.io/payment/success',
      expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 jam
    };

    const signature = crypto.createHmac('sha256', TRIPAY_PRIVATE_KEY)
      .update(TRIPAY_MERCHANT_CODE + booking_code + amount)
      .digest('hex');

    const response = await axios.post(TRIPAY_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${TRIPAY_API_KEY}`,
        'Content-Type': 'application/json',
        'Signature': signature
      }
    });

    const paymentData = response.data.data;

    // Simpan ke database
    await prisma.payments.create({
      data: {
        booking_id: BigInt(booking_id),
        merchant_ref: booking_code,
        amount: amount,
        status: 'unpaid',
        payment_url: paymentData.checkout_url,
        reference: paymentData.reference,
        method: method,
        expired_time: new Date(paymentData.expired_time * 1000),
      },
    });

    return res.json({
      message: 'Payment created successfully',
      payment_url: paymentData.checkout_url
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ message: 'Error creating payment', detail: error.response?.data || error.message });
  }
});

module.exports = router;
