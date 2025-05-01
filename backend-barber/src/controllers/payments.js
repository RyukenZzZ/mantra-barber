const { successResponse } = require('../utils/response');
const paymentServices = require("../services/payments");

exports.createPayment = async (req, res) => {
  const { bookingId, method } = req.body;

  const result = await paymentServices.processPayment({ bookingId, method });

  return successResponse(res, result);
};

exports.paymentCallback = async (req, res) => {
  const callbackData = req.body;

  await handleTripayCallback(callbackData);

  return successResponse(res, { message: 'Callback berhasil diproses' });
};
