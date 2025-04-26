const BookingRepository = require("../repositories/bookings");
const { v4: uuidv4 } = require('uuid');
const { NotFoundError, InternalServerError } = require("../utils/request");

const generateBookingCode = () => {
  const code = uuidv4().slice(0, 6).toUpperCase(); // Potong 8 karakter pertama
  return `MB-${code}`;
};

exports.getBookings = async (cust_name,booking_code) => {
  const Bookings = await BookingRepository.getBookings(cust_name,booking_code);
  if (Bookings.length === 0) {
    throw new NotFoundError("No Bookings found with the given criteria!");
  }
  return Bookings;
};

exports.getBookingById = async (id) => {
  const Booking = await BookingRepository.getBookingById(id);
  if (!Booking) {
    throw new NotFoundError("Booking not found!");
  }
  return Booking;
};

exports.createBooking = async (data,user_id) => {
  data.user_id = user_id;
  data.created_by = user_id;
  console.log(user_id);
  data.booking_code = generateBookingCode();
  return BookingRepository.createBooking(data);
};

exports.updateBooking = async (id, data, user_id) => {
  const existingBooking = await BookingRepository.getBookingById(id);
  if (!existingBooking) {
    throw new NotFoundError("Booking not found!");
  }
  //input created/updated by user
  data.created_by = user_id;


  // replicated existing data with new data
  data = {
    ...existingBooking, // existing Student
    ...data,
  };

  const updatedBooking = await BookingRepository.updateBooking(id, data);
  if (!updatedBooking) {
    throw new InternalServerError("Failed to update the Booking!");
  }

  return updatedBooking;
};

exports.deleteBookingById = async (id) => {
  const existingBooking = await BookingRepository.getBookingById(id);
  if (!existingBooking) {
    throw new NotFoundError("Booking not found!");
  }

  const deletedBooking = await BookingRepository.deleteBookingById(id);
  if (!deletedBooking) {
    throw new InternalServerError("Failed to delete the Booking!");
  }

  return deletedBooking;
};
