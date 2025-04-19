const express = require("express");
const authRouter = require("./auth");
const serviceRouter = require("./services");
const productRouter = require("./products");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/services",serviceRouter);
router.use("/products",productRouter);

module.exports = router;