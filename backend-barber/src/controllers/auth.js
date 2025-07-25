const authService = require ("../services/auth");
const {successResponse} = require("../utils/response");

exports.register = async (req, res, next) => {
    const data = await authService.register(req.body, req.files);
    successResponse(res,data);
}

exports.login = async (req, res, next) => {
    const data = await authService.login(req.body.email, req.body.password);
    successResponse(res, data);
};

exports.googleLogin = async (req, res, next) => {
    const data = await authService.googleLogin(req.body.access_token);
    successResponse(res, data);
};

exports.getProfile = async (req, res, next) => {
    const data = req.user;
    // remove the password object
    delete data.password;
    successResponse(res, data);
};

exports.updateProfile = async (req, res, next) => {
    const user_id = req.user.id;
    const updatedUser = await authService.updateProfile(
      user_id,
      req.body,
      req.files 
    )
    successResponse(res, updatedUser);
};