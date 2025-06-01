const express = require('express');
const router = express.Router();
const { resumePayment,handleMidtransNotification } = require('../controllers/payments');
const { authorization } = require('../middlewares/auth');
const { adminRole, userRole } = require('../constants/auth');

router.get("/:id",authorization(adminRole,userRole), resumePayment);
router.post("/midtrans-notification", handleMidtransNotification);

module.exports = router;
