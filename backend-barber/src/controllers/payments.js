// controllers/paymentController.js
const paymentService = require("../services/payments");
const { successResponse } = require("../utils/response");

exports.resumePayment = async (req, res) => {
    const bookingId = parseInt(req.params.id);

    const data = await paymentService.resumePayment(bookingId);
    successResponse(res, data.data, data.message);
};

exports.handleMidtransNotification = async (req, res) => {
    await paymentService.handleNotification(req.body);
    successResponse(res, "OK");
};

exports.getPayments = async (req,res,next) => {
    const data = await paymentService.getPayments();
    successResponse(res,data);
};
