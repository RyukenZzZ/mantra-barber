// File: utils/midtransClient.js
const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = snap;

// exports.createMidtransTransaction = async ({ orderId, amount, customer }) => {
//   const transaction = await snap.createTransaction({
//     transaction_details: {
//       order_id: orderId,
//       gross_amount: amount,
//     },
//     customer_details: customer,
//     expiry: {
//       unit: "minute",
//       duration: 20,
//     },
//   });

//   return transaction;
// };
