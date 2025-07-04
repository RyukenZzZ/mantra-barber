const express = require('express');
const router = express.Router();
const { resumePayment,handleMidtransNotification,getPayments } = require('../controllers/payments');
const { authorization } = require('../middlewares/auth');
const { adminRole, userRole } = require('../constants/auth');

router.get("/",authorization(adminRole),getPayments)
router.get("/:id",resumePayment);
router.post("/midtrans-notification", handleMidtransNotification);

module.exports = router;
