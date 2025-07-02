const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Function untuk auto-cancel
async function autoCancelExpiredBookings() {
  const now = new Date();

  // Update payments yang unpaid dan sudah expired
  await prisma.payments.updateMany({
    where: {
      status: 'unpaid',
      expired_time: {
        lte: now,
      },
    },
    data: {
      status: 'expired',
    },
  });

  // Update bookings yang isPending DAN payment-nya expired
  await prisma.bookings.updateMany({
    where: {
      status: 'isPending', 
      payments: {
        some: {
          status: 'expired',
        },
      },
    },
    data: {
      status: 'expired', // Atau status yang kamu inginkan
    },
  });

  await prisma.payments.deleteMany({
  where: {
    status: "expired",
  },
});

await prisma.bookings.deleteMany({
  where: {
    status: "expired",
  },
});

  console.log(`[${now.toISOString()}] Auto-cancel expired bookings executed`);
}

module.exports = autoCancelExpiredBookings;
