// services/paymentService.js
const { NotFoundError, Forbidden,BadRequestError } = require("../utils/request");
const midtransClient = require("midtrans-client");
const paymentRepository = require("../repositories/payments");
const bookingRepository = require("../repositories/bookings");

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

exports.resumePayment = async (userId, bookingId) => {
  const booking = await bookingRepository.findBookingWithPayment(bookingId);
  if (!booking) throw new NotFoundError("Booking tidak ditemukan");
  if (booking.user_id !== userId) throw new Forbidden("Akses ditolak");

  const payment = booking.payments[0];
  if (!payment) throw new NotFoundError("Data payment tidak tersedia");

  const now = new Date();
  const expiredTime = new Date(payment.expired_time);

  if (payment.status === "paid") {
    return { message: "Pembayaran sudah selesai", data: { paid_at: payment.paid_at } };
  }
  if (payment.status === "unpaid" && expiredTime > now) {
    return {
      message: "Lanjutkan pembayaran",
      data: {
        snap_token: payment.snap_token,
        snap_url:payment.snap_url,
        pdf_url: payment.pdf_url,
        expired_time:expiredTime,
        amount:payment.amount,
      },
    };
  }
  // TODO: Implement create new transaction if expired
  throw new BadRequestError("Pembayaran sudah kadaluarsa, silakan buat ulang booking.");
 ;
};

exports.handleNotification = async (notificationBody) => {
  const notif = await core.transaction.notification(notificationBody);
  const { transaction_status, order_id } = notif;
  if (transaction_status === "settlement" || transaction_status === "capture") {
    const bookingCode = order_id.replace(/^BOOK-/, "").replace(/-\d+$/, "");
    await paymentRepository.markAsPaid(order_id);
    await bookingRepository.updateStatusByCode(bookingCode, "booked");
  }
};

