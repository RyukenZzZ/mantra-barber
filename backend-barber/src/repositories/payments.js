const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.findPaymentByBookingId = (bookingId) => {
  return prisma.payments.findFirst({ where: { booking_id: bookingId } });
};

exports.findPaymentByReference = (reference) => {
  return prisma.payments.findUnique({ where: { reference } });
};

exports.updatePayment = (id, data) => {
  return prisma.payments.update({
    where: { id },
    data,
  });
};
