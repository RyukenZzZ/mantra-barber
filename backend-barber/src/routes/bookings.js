const express = require("express");
const {authorization} = require("../middlewares/auth");
const {optionalAuthorization} = require("../middlewares/optionalAuth")
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
    updateStatusBookingById,
} = require("../controllers/bookings");

const router = express.Router();

router
.route("/")
.get(validateGetBookings,getBookings)
.post(optionalAuthorization,validateCreateBooking,createBooking);

router
.route("/my-bookings")
.get(authorization(adminRole,userRole),getBookingByUserId)

router
.route("/:id")
.get(validateGetBookingById,getBookingById)
.put(authorization(adminRole),validateUpdateBooking,updateBooking)
.delete(authorization(adminRole),validateDeleteBookingById,deleteBookingById)
.patch(authorization(adminRole,userRole),updateStatusBookingById);

module.exports = router;