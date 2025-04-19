const express = require("express");
const {authorization} = require("../middlewares/auth");
const {adminRole, userRole} = require("../constants/auth");
const {
    validateGetBarbers,
    validateGetBarberById,
    validateCreateBarber,
    validateUpdateBarber,
    validateDeleteBarberById,
} = require ("../middlewares/barbers");
const {
    getBarbers,
    getBarberById,
    createBarber,
    updateBarber,
    deleteBarberById,
} = require("../controllers/barbers");

const router = express.Router();

router
.route("/")
.get(authorization(adminRole,userRole),validateGetBarbers,getBarbers)
.post(authorization(adminRole),validateCreateBarber,createBarber);

router
.route("/:id")
.get(authorization(adminRole,userRole),validateGetBarberById,getBarberById)
.put(authorization(adminRole),validateUpdateBarber,updateBarber)
.delete(authorization(adminRole),validateDeleteBarberById,deleteBarberById);

module.exports = router;