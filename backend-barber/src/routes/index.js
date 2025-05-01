const express = require("express");
const authRouter = require("./auth");
const serviceRouter = require("./services");
const productRouter = require("./products");
const barberRouter = require ("./barbers");
const bookingsRouter = require("./bookings");
const paymentsRouter = require("./payments");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/services",serviceRouter);
router.use("/products",productRouter);
router.use("/barbers",barberRouter);
router.use("/bookings",bookingsRouter);
router.use("/payments",paymentsRouter);

module.exports = router;