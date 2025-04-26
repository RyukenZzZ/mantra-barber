const { z } = require("zod");
const { BadRequestError } = require("../utils/request");

exports.validateGetBookings = (req, res, next) => {
  const validateQuery = z.object({
    name: z.string().nullable().optional(),
    booking_code: z.string().nullable().optional(),
  });

  const resultValidateQuery = validateQuery.safeParse(req.query);
  if (!resultValidateQuery.success) {
    throw new BadRequestError(resultValidateQuery.error.errors);
  }
  next();
};

exports.validateGetBookingById = (req, res, next) => {
  req.params = { ...req.params, id: Number(req.params.id) };

  const validateParams = z.object({
    id: z.number(),
  });

  const result = validateParams.safeParse(req.params);
  if (!result.success) {
    throw new BadRequestError(result.error.errors);
  }

  next();
};

exports.validateCreateBooking = (req, res, next) => {

  const validateBody = z.object({
    cust_name: z.string(),
    cust_phone_number: z.string(),
    cust_email: z.string(),
    barber_id: z.string(),
    service_id: z.string(),
    booking_date: z.coerce.date(),
    booking_time:z.coerce.date(),
    source: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
  });


  const result = validateBody.safeParse(req.body);
  if (!result.success) {
    throw new BadRequestError(result.error.errors);
  }


  next();
};

exports.validateUpdateBooking = (req, res, next) => {
  req.params.id = Number(req.params.id);

  const validateParams = z.object({
    id: z.number(),
  });

  const resultValidateParams = validateParams.safeParse(req.params);
  if (!resultValidateParams.success) {
    throw new BadRequestError(resultValidateParams.error.errors);
  }

  const validateBody = z.object({
    cust_name: z.string(),
    cust_phone_number: z.string(),
    cust_email: z.string(),
    barber_id: z.string(),
    service_id: z.string(),
    booking_date: z.coerce.date(),
    booking_time:z.coerce.date(),
    source: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
  }).partial();

  
  const resultValidateBody = validateBody.safeParse(req.body);
  if (!resultValidateBody.success) {
    throw new BadRequestError(resultValidateBody.error.errors);
  }

  next();
};

exports.validateDeleteBookingById = (req, res, next) => {
  req.params.id = Number(req.params.id);

  const validateParams = z.object({
    id: z.number(),
  });

  const resultValidateParams = validateParams.safeParse(req.params);
  if (!resultValidateParams.success) {
    throw new BadRequestError(resultValidateParams.error.errors);
  }

  next();
};
