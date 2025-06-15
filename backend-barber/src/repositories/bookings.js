const { PrismaClient } = require("@prisma/client");
const JSONBigInt = require("json-bigint");
const { NotFoundError } = require("../utils/request");
const midtransClient = require('../utils/midtrans-client'); // pastikan ini mengarah ke konfigurasi midtrans kamu

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

exports.getBookingByUserId = async (user_id) => {
  const Bookings = await prisma.bookings.findMany({
    where: { user_id:user_id },
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

  if (!Bookings) return null;
  
  const formattedBookingsByUserId = Bookings.map(booking => ({
    id: booking.id,
    user_id: booking.user_id,
    users: booking.users_bookings_user_idTousers,
    cust_name: booking.cust_name,
    cust_phone_number: booking.cust_phone_number,
    cust_email: booking.cust_email,
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
    created_at: booking.created_at
  }));
  

  const serializedData = JSONBigInt.stringify(formattedBookingsByUserId);
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

  const multiplier = newBooking.source === "online" ? 0.5 : 1;

   // 2. Hitung jumlah pembayaran (50% dari harga layanan)
   const amount = newBooking.services?.price
   ? Math.floor(newBooking.services.price * multiplier)
   : 0;

 // 3. Buat payment record
 const newPayment = await prisma.payments.create({
   data: {
     amount,
     status: 'unpaid',
     expired_time: new Date(Date.now() + 20 * 60 * 1000), // 20 menit dari sekarang
     bookings: {
       connect: { id: newBooking.id },
     },
   },
 });

 // 4. Siapkan payload Midtrans
 const orderId = `BOOK-${newBooking.booking_code}-${Date.now()}`;
 const midtransPayload = {
   transaction_details: {
     order_id: orderId,
     gross_amount: amount,
   },
       item_details: [
            {
                id: newBooking.services?.id,
                price: amount, 
                quantity: 1,
                name: newBooking.services?.name,
            },
          ],
   customer_details: {
     first_name: newBooking.cust_name,
     email: newBooking.cust_email,
     phone: newBooking.cust_phone_number,
   },
   expiry: {
     unit: "minute",
     duration: 20,
   },
 };

 // 5. Kirim request ke Midtrans
 const midtransResponse = await midtransClient.createTransaction(midtransPayload);
 const { token, redirect_url } = midtransResponse;


 // 6. Update payment dengan response dari Midtrans
 await prisma.payments.update({
   where: { id: newPayment.id },
   data: {
     snap_url: redirect_url,
     snap_token:token,
     reference: orderId,
     pdf_url: midtransResponse?.pdf_url ?? null,
   },
 });

 // 7. Kembalikan data booking + payment
 const responseData = {
   booking: {
     id: newBooking.id,
     user_id: newBooking.user_id,
     users: newBooking.users_bookings_user_idTousers,
     cust_name: newBooking.cust_name,
     cust_phone_number: newBooking.cust_phone_number,
     cust_email: newBooking.cust_email,
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
     created_at: newBooking.created_at,
   },
   payment: {
     id: newPayment.id,
     booking_id: newPayment.booking_id,
     reference: midtransResponse.order_id,
     amount: newPayment.amount,
     status: newPayment.status,
     snap_token:token,
     snap_url: midtransResponse.redirect_url,
     pdf_url: midtransResponse?.pdf_url ?? null,
     expired_time: newPayment.expired_time,
     created_at: newPayment.created_at,
   },
 };

 const serializedData = JSONBigInt.stringify(responseData);
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

exports.findBookingWithPayment = async (bookingId) => {
  const dataBookingwithPayment= await prisma.bookings.findUnique({
    where: { id: bookingId },
    include: { services: true, payments: true },
  });

  const serializedData = JSONBigInt.stringify(dataBookingwithPayment);
  return JSONBigInt.parse(serializedData);
};

exports.updateStatusByCode = async (bookingCode, status) => {
  return prisma.bookings.updateMany({
    where: { booking_code: bookingCode },
    data: { status },
  });
};

exports.updateBookingStatusById = async (bookingId, status) => {
  const update= await prisma.bookings.update({
   where: {
      id:bookingId,
    },
     data: { status:status },
  });

  const serializedData = JSONBigInt.stringify(update);
  return JSONBigInt.parse(serializedData);
};