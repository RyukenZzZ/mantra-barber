const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.markAsPaid = async (orderId) => {
  return prisma.payments.updateMany({
    where: { reference: orderId },
    data: { status: "paid", paid_at: new Date() },
  });
};
