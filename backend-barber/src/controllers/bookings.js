const BookingsServices = require("../services/bookings");
const {successResponse} = require("../utils/response");

exports.getBookings = async (req,res,next) => {
    const data = await BookingsServices.getBookings(
        req.query?.cust_name,
        req.query?.booking_code
    );
    successResponse(res,data);
};

exports.getBookingById = async (req,res,next) => {
    const {id} = req.params;
    const data = await BookingsServices.getBookingById(id);
    successResponse(res,data,"Booking found successfully.");
};

exports.getBookingByUserId = async (req,res,next) => {
  const user_id = req.user.id;
  const data = await BookingsServices.getBookingByUserId(user_id);
  successResponse(res,data,"Booking found successfully.");
};

exports.createBooking = async (req, res, next) => {
    const user_id = req.user ? req.user.id : null; // Jika login ambil id, kalau tidak login biarkan null
    const data = await BookingsServices.createBooking(req.body,user_id);
    successResponse(res, data, "Booking successfully added!");
  };
  
  exports.updateBooking = async (req, res, next) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const data = await BookingsServices.updateBooking(id, req.body,user_id);
    successResponse(res, data, "Booking successfully updated!");
  };
  
  exports.deleteBookingById = async (req, res, next) => {
    const { id } = req.params;
    const data = await BookingsServices.deleteBookingById(id);
    successResponse(res, data, "Booking successfully deleted!");
  };
  
  exports.updateStatusBookingById = async (req,res,next) => {
    const {id} = req.params;
    const {status} = req.body;
    const data = await BookingsServices.updateBookingStatusById(id,status);
    successResponse(res,data,`Booking ${status}`)
  }