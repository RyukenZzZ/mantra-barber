const {z} = require("zod");
const {BadRequestError} = require("../utils/request")

exports.validateGetServices = (req,res,next) => {
    const validateQuery = z.object({
        name: z.string().nullable().optional(),
    });

    const resultValidateQuery = validateQuery.safeParse(req.query);
    if (!resultValidateQuery.success){
        throw new BadRequestError(resultValidateQuery.error.errors);
    }
    next();
};

exports.validateGetServiceById = (req,res,next) => {
    req.params = {...req.params, id: Number(req.params.id)};

    const validateParams = z.object({
        id : z.number(),
    });

    const result = validateParams.safeParse(req.params);
    if (!result.success){
        throw new BadRequestError(result.error.errors);
    }

    next();
};

exports.validateCreateService = (req,res,next) => {
    if (req.body.price) {
        req.body.price = parseInt(req.body.price);
    }

    const validateBody = z.object({
        name:z.string(),
        description:z.string(),
        price:z.number(),
    });

    const result = validateBody.safeParse(req.body);
    if (!result.success){
        throw new BadRequestError(result.error.errors);
    }

    next();
}

exports.validateUpdateService = (req,res,next) => {

    req.params.id = Number(req.params.id);

    const validateParams = z.object({
        id: z.number(),
    });

    const resultValidateParams = validateParams.safeParse(req.params);
    if(!resultValidateParams.success){
        throw new BadRequestError(resultValidateParams.error.errors);
    }

    if (req.body.price) {
        req.body.price = parseInt(req.body.price);
    }

    const validateBody = z.object({
        name:z.string(),
        description:z.string(),
        price:z.number(),
    });

    const resultValidateBody = validateBody.safeParse(req.body);
    if (!resultValidateBody){
        throw new BadRequestError(resultValidateBody.error.errors);
    }

    next();
}

exports.validateDeleteServiceById = (req,res,next) => {
    req.params.id = Number(req.params.id);

    const validateParams = z.object({
        id: z.number(),
    });

    const resultValidateParams = validateParams.safeParse(req.params);
    if(!resultValidateParams.success){
        throw new BadRequestError(resultValidateParams.error.errors);
    }

    next();
}