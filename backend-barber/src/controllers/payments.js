// controllers/paymentController.js
const paymentService = require("../services/payments");
const { successResponse } = require("../utils/response");

exports.resumePayment = async (req, res) => {
    const user_id = req.user.id;
    const data = await paymentService.resumePayment(user_id, parseInt(req.params.bookingId));
    successResponse(res, data.message, data.data);
};

exports.handleMidtransNotification = async (req, res) => {
    await paymentService.handleNotification(req.body);
    successResponse(res, "OK");
};

