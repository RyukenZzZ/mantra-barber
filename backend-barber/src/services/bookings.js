const BookingRepository = require("../repositories/bookings");
const paymentRepository = require("../repositories/payments");
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

exports.getBookingByUserId = async (user_id) => {
  const Booking = await BookingRepository.getBookingByUserId(user_id);
  if (!Booking || Object.keys(Booking).length === 0) {
    throw new NotFoundError("Kamu belum pernah melakukan booking sama sekali !");
  }
  
  return Booking;
};

exports.createBooking = async (data,user_id) => {
  data.user_id = user_id;
  data.created_by = user_id;
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

exports.updateBookingStatusById = async (bookingId, status) => {
  const existingBooking = await BookingRepository.getBookingById(bookingId);
  if (!existingBooking) {
    throw new NotFoundError("Booking not found!");
  }

  const payment = await paymentRepository.getPaymentById(bookingId);
  if (!payment) {
    throw new NotFoundError("Payment not found!");
  }

  const updatedBookingStatusById = await BookingRepository.updateBookingStatusById(bookingId, status);
  if (!updatedBookingStatusById) {
    throw new InternalServerError("Failed to update the Booking Status!");
  }

  const times_by = existingBooking.source === "online" ? 2 : 1;
  // Logika: jika status "done", maka bayar lunas (amount * times_by bisa 2 jika booking online dan 1 jika offline)
  const newAmount = status === "done" ? payment.amount * times_by : payment.amount;

  const updatedPaymentStatusById = await paymentRepository.updatePaymentStatusById(
    payment.id,
    status,
    newAmount
  );

  if (!updatedPaymentStatusById) {
    throw new InternalServerError("Failed to update the Payment Status!");
  }

  return {
    booking: updatedBookingStatusById,
    payment: updatedPaymentStatusById,
  };
};
