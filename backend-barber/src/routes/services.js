const express = require("express");
const {authorization} = require("../middlewares/auth");
const {adminRole, userRole} = require("../constants/auth");
const {
    validateGetServices,
    validateGetServiceById,
    validateCreateService,
    validateUpdateService,
    validateDeleteServiceById,
} = require ("../middlewares/services");
const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteServiceById,
} = require("../controllers/services");

const router = express.Router();

router
.route("/")
.get(authorization(adminRole,userRole),validateGetServices,getServices)
.post(authorization(adminRole),validateCreateService,createService);

router
.route("/:id")
.get(authorization(adminRole,userRole),validateGetServiceById,getServiceById)
.put(authorization(adminRole),validateUpdateService,updateService)
.delete(authorization(adminRole),validateDeleteServiceById,deleteServiceById);

module.exports = router;