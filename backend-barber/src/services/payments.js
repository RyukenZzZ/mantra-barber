// services/paymentService.js
const { NotFoundError, Forbidden } = require("../utils/request");
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

  const payment = booking.payments;
  if (!payment) throw new NotFoundError("Data payment tidak tersedia");

  const now = new Date();
  if (payment.status === "paid") {
    return { message: "Pembayaran sudah selesai", data: { paid_at: payment.paid_at } };
  }
  if (payment.status === "unpaid" && payment.expired_time > now) {
    return {
      message: "Lanjutkan pembayaran",
      data: {
        payment_url: payment.payment_url,
        pdf_url: payment.pdf_url,
      },
    };
  }
  // TODO: Implement create new transaction if expired
  return { message: "Pembayaran kadaluarsa, mohon buat ulang." };
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

