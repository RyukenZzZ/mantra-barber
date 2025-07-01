const { PrismaClient } = require("@prisma/client");
const JSONBigInt = require("json-bigint");
const { NotFoundError } = require("../utils/request");
const prisma = new PrismaClient();


exports.markAsPaid = async (orderId,payment_type) => {
 return await prisma.payments.updateMany({
  where: { reference: orderId },
  data: { status: "paid",method:payment_type, paid_at: new Date() },
});


};

exports.updatePaymentStatusById = async (id, status,amount) => {
  const update= await prisma.payments.update({
   where: {
      id:id,
    },
     data: { status:status,amount:amount },
  });

  const serializedData = JSONBigInt.stringify(update);
  return JSONBigInt.parse(serializedData);
};

exports.getPaymentById = async (bookingId) => {
  const payment = await prisma.payments.findFirst({
    where: {
      booking_id: bookingId,
    },
  });

    if (!payment) return null;
  const serializedData = JSONBigInt.stringify(payment);
  return JSONBigInt.parse(serializedData);
}

exports.getPayments = async () => {
  const Payments = await prisma.payments.findMany({
    include: {
      bookings: true,
    },
  });  const serializedData = JSONBigInt.stringify(Payments);
  return JSONBigInt.parse(serializedData);
};