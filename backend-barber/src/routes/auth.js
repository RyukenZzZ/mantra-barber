const express = require("express");
const {
    validateRegister,
    validateLogin,
    authorization,
    validateGoogleLogin,
    validateUpdateUser
} = require("../middlewares/auth");
const { register, login, getProfile,googleLogin,updateProfile } = require("../controllers/auth");
const { adminRole, userRole } = require("../constants/auth");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/google/login", validateGoogleLogin, googleLogin);
router.get("/profile", authorization(adminRole, userRole), getProfile);
router.put("/profile",authorization(adminRole, userRole), validateUpdateUser,updateProfile)


module.exports = router;