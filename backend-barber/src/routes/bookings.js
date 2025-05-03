const express = require("express");
const {authorization} = require("../middlewares/auth");
const {adminRole, userRole} = require("../constants/auth");
const {
    validateGetBookings,
    validateGetBookingById,
    validateCreateBooking,
    validateUpdateBooking,
    validateDeleteBookingById,
} = require ("../middlewares/bookings");
const {
    getBookings,
    getBookingById,
    getBookingByUserId,
    createBooking,
    updateBooking,
    deleteBookingById,
} = require("../controllers/bookings");

const router = express.Router();

router
.route("/")
.get(authorization(adminRole,userRole),validateGetBookings,getBookings)
.post(authorization(adminRole,userRole),validateCreateBooking,createBooking);

router
.route("/my-bookings")
.get(authorization(adminRole,userRole),getBookingByUserId)

router
.route("/:id")
.get(authorization(adminRole,userRole),validateGetBookingById,getBookingById)
.put(authorization(adminRole),validateUpdateBooking,updateBooking)
.delete(authorization(adminRole),validateDeleteBookingById,deleteBookingById);

module.exports = router;