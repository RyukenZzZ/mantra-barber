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
    updateManyDate
} = require("../controllers/barbers");

const router = express.Router();

router
.route("/")
.get(validateGetBarbers,getBarbers)
.post(authorization(adminRole),validateCreateBarber,createBarber)
.put(authorization(adminRole),updateManyDate);

router
.route("/:id")
.get(validateGetBarberById,getBarberById)
.put(authorization(adminRole),validateUpdateBarber,updateBarber)
.delete(authorization(adminRole),validateDeleteBarberById,deleteBarberById);

module.exports = router;