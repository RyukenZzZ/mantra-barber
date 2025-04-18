const express = require("express");
const authRouter = require("./auth");
const serviceRouter = require("./services");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/services",serviceRouter);

module.exports = router;