const express = require('express');
const router = express.Router();
const { resumePayment,handleMidtransNotification } = require('../controllers/payments');

router.get("/resume-payment/:bookingId",resumePayment);
router.post("/midtrans-notification", handleMidtransNotification);

module.exports = router;
