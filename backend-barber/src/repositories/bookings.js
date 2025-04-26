const { PrismaClient } = require("@prisma/client");
const JSONBigInt = require("json-bigint");
const { NotFoundError } = require("../utils/request");


const prisma = new PrismaClient();

exports.getBookings = async (cust_name, booking_code) => {
  // Filter berdasarkan name jika ada
  const filter = {
    where: {
      AND: [
        booking_code
          ? {
              booking_code: {
                contains: booking_code,
                mode: 'insensitive',
              },
            }
          : {},
        cust_name
          ? {
              cust_name: {
                  contains: cust_name,
                  mode: 'insensitive',
              },
            }
          : {},
      ],
    },
    include: {
      users_bookings_user_idTousers: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      barbers: {
        select: {
          name: true,
        },
      },
      services: {
        select: {
          name: true,
          price: true,
        },
      },
      users_bookings_created_byTousers:{
        select: {
          name: true,
        },
      },
    },
  };

  const Bookings = await prisma.bookings.findMany(filter);
  const formattedAllBookingData = Bookings.map((booking) => ({
    id: booking.id,
    user_id: booking.user_id,
    users: booking.users_bookings_user_idTousers,
    cust_name:booking.cust_name,
    cust_phone_number:booking.cust_phone_number,
    cust_email:booking.cust_email,
    barber_id: booking.barber_id,
    barbers: booking.barbers,
    service_id: booking.service_id,
    services: booking.services,
    booking_date: booking.booking_date,
    booking_time: booking.booking_time,
    source: booking.source,
    status: booking.status,
    booking_code: booking.booking_code,
    created_by: booking.created_by,
    created_by_name: booking.users_bookings_created_byTousers,
    created_at: booking.created_at,
  }));

  const serializedData = JSONBigInt.stringify(formattedAllBookingData);
  return JSONBigInt.parse(serializedData);
};

exports.getBookingById = async (id) => {
  const Booking = await prisma.bookings.findUnique({
    where: { id },
    include: {
      users_bookings_user_idTousers: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      barbers: {
        select: {
          name: true,
        },
      },
      services: {
        select: {
          name: true,
          price: true,
        },
      },
      users_bookings_created_byTousers:{
        select: {
          name: true,
        },
      },
    },
  });

  if (!Booking) return null;
  
  const formattedBookingDataById = {
    id: Booking.id,
    user_id: Booking.user_id,
    users: Booking.users_bookings_user_idTousers,
    cust_name:Booking.cust_name,
    cust_phone_number:Booking.cust_phone_number,
    cust_email:Booking.cust_email,
    barber_id: Booking.barber_id,
    barbers: Booking.barbers,
    service_id: Booking.service_id,
    services: Booking.services,
    booking_date: Booking.booking_date,
    booking_time: Booking.booking_time,
    source: Booking.source,
    status: Booking.status,
    booking_code: Booking.booking_code,
    created_by: Booking.created_by,
    created_by_name: Booking.users_bookings_created_byTousers,
    created_at: Booking.created_at
  };

  const serializedData = JSONBigInt.stringify(formattedBookingDataById);
  return JSONBigInt.parse(serializedData);
};

exports.createBooking = async (data) => {
  const newBooking = await prisma.bookings.create({
    data,
    include: {
      users_bookings_user_idTousers: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      barbers: {
        select: {
          name: true,
        },
      },
      services: {
        select: {
          name: true,
          price: true,
        },
      },
      users_bookings_created_byTousers:{
        select: {
          name: true,
        },
      },
    },
  });

const formattedBookingData = {
  id: newBooking.id,
  user_id: newBooking.user_id,
  users: newBooking.users_bookings_user_idTousers,
  cust_name:newBooking.cust_name,
  cust_phone_number:newBooking.cust_phone_number,
  cust_email:newBooking.cust_email,
  barber_id: newBooking.barber_id,
  barbers: newBooking.barbers,
  service_id: newBooking.service_id,
  services: newBooking.services,
  booking_date: newBooking.booking_date,
  booking_time: newBooking.booking_time,
  source: newBooking.source,
  status: newBooking.status,
  booking_code: newBooking.booking_code,
  created_by: newBooking.created_by,
  created_by_name: newBooking.users_bookings_created_byTousers,
  created_at: newBooking.created_at
};

  const serializedData = JSONBigInt.stringify(formattedBookingData);
  return JSONBigInt.parse(serializedData);
};

exports.updateBooking = async (id, data) => {
  const { user_id, barber_id, service_id } = data;

  // Check if related IDs exist
  const user = await prisma.users.findUnique({
    where: { id: user_id },
  });
  const barber = await prisma.barbers.findUnique({ where: { id: barber_id } });
  const service = await prisma.services.findUnique({ where: { id: service_id } });


  if (!user)
    throw new NotFoundError(`user with ID ${user_id} not found`);
  if (!barber) throw new NotFoundError(`barber with ID ${barber_id} not found`);
  if (!service) throw new NotFoundError(`service with ID ${service_id} not found`);


  const updatedBooking = await prisma.bookings.update({
    where: {
      id: Number(id),
    },
    data: {
      cust_name: data.cust_name,  // Update cust_name
      cust_phone_number: data.cust_phone_number,
      cust_email: data.cust_email,
      booking_date: data.booking_date,
      booking_time: data.booking_time,
      source: data.source,
      status: data.status,
      booking_code: data.booking_code,
      created_at: data.created_at,
      users_bookings_user_idTousers: {
        connect: { id: data.user_id }
      },
      users_bookings_created_byTousers: {
        connect: { id: data.created_by }
      },
      barbers: {
        connect: { id: data.barber_id }
      },
      services: {
        connect: { id: data.service_id }
      }
    },
    include: {
      users_bookings_user_idTousers: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      barbers: {
        select: {
          name: true,
        },
      },
      services: {
        select: {
          name: true,
          price: true,
        },
      },
      users_bookings_created_byTousers:{
        select: {
          name: true,
        },
      },
    },
  });

  const formattedUpdatedBookingData = {
    id: updatedBooking.id,
    user_id: updatedBooking.user_id,
    users: updatedBooking.users_bookings_user_idTousers,
    cust_name:updatedBooking.cust_name,
    cust_phone_number:updatedBooking.cust_phone_number,
    cust_email:updatedBooking.cust_email,
    barber_id: updatedBooking.barber_id,
    barbers: updatedBooking.barbers,
    service_id: updatedBooking.service_id,
    services: updatedBooking.services,
    booking_date: updatedBooking.booking_date,
    booking_time: updatedBooking.booking_time,
    source: updatedBooking.source,
    status: updatedBooking.status,
    booking_code: updatedBooking.booking_code,
    created_by: updatedBooking.created_by,
    created_by_name: updatedBooking.users_bookings_created_byTousers,
    created_at: updatedBooking.created_at
  };
  const serializedData = JSONBigInt.stringify(formattedUpdatedBookingData);
  return JSONBigInt.parse(serializedData);
};

exports.deleteBookingById = async (id) => {
  const deletedBooking = await prisma.bookings.delete({
    where: {
      id: Number(id),
    },
    include: {
      users_bookings_user_idTousers: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      barbers: {
        select: {
          name: true,
        },
      },
      services: {
        select: {
          name: true,
          price: true,
        },
      },
      users_bookings_created_byTousers:{
        select: {
          name: true,
        },
      },
    },
  });
  const serializedData = JSONBigInt.stringify(deletedBooking);
  return JSONBigInt.parse(serializedData);
};
