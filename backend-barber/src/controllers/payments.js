// controllers/paymentController.js
const paymentService = require("../services/payments");
const { successResponse } = require("../utils/response");

exports.resumePayment = async (req, res) => {
    const user_id = req.user.id;
    const bookingId = parseInt(req.params.id);

    const data = await paymentService.resumePayment(user_id, bookingId);
    successResponse(res, data.data, data.message);
};

exports.handleMidtransNotification = async (req, res) => {
    await paymentService.handleNotification(req.body);
    successResponse(res, "OK");
};

