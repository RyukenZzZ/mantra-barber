const { z } = require("zod");
const { BadRequestError } = require("../utils/request");

exports.validateGetBarbers = (req, res, next) => {
  const validateQuery = z.object({
    name: z.string().nullable().optional(),
  });

  const resultValidateQuery = validateQuery.safeParse(req.query);
  if (!resultValidateQuery.success) {
    throw new BadRequestError(resultValidateQuery.error.errors);
  }
  next();
};

exports.validateGetBarberById = (req, res, next) => {
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

exports.validateCreateBarber = (req, res, next) => {
  if (req.body.price) {
    req.body.price = parseInt(req.body.price);
  }

  if (typeof req.body.is_active === "string") {
    req.body.is_active = req.body.is_active === "true";
  }
  

  const validateBody = z.object({
    name: z.string(),
    bio: z.string(),
    is_active:z.boolean(),
  });

  // The file is not required
  const validateFileBody = z
    .object({
      photo_url: z
        .object({
          name: z.string(),
          data: z.any(),
        })
        .nullable()
        .optional(),
    })
    .nullable();

  const result = validateBody.safeParse(req.body);
  if (!result.success) {
    throw new BadRequestError(result.error.errors);
  }

  const resultValidateFiles = validateFileBody.safeParse(req.files);
  if (!resultValidateFiles) {
    throw new BadRequestError(resultValidateFiles.error.errors);
  }

  next();
};

exports.validateUpdateBarber = (req, res, next) => {
  req.params.id = Number(req.params.id);

  const validateParams = z.object({
    id: z.number(),
  });

  const resultValidateParams = validateParams.safeParse(req.params);
  if (!resultValidateParams.success) {
    throw new BadRequestError(resultValidateParams.error.errors);
  }

  if (req.body.price) {
    req.body.price = parseInt(req.body.price);
  }
  
  if (typeof req.body.is_active === "string") {
    req.body.is_active = req.body.is_active === "true";
  }
  

  const validateBody = z.object({
    name: z.string(),
    bio: z.string(),
    is_active: z.boolean(),
  });

  // The file is not required
  const validateFileBody = z
    .object({
      photo_url: z
        .object({
          name: z.string(),
          data: z.any(),
        })
        .nullable()
        .optional(),
    })
    .nullable();

  const resultValidateBody = validateBody.safeParse(req.body);
  if (!resultValidateBody) {
    throw new BadRequestError(resultValidateBody.error.errors);
  }

  const resultValidateFiles = validateFileBody.safeParse(req.files);
  if (!resultValidateBody) {
    throw new BadRequestError(resultValidateFiles.error.errors);
  }

  next();
};

exports.validateDeleteBarberById = (req, res, next) => {
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
