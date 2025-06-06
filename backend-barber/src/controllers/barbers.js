const barbersServices = require("../services/barbers");
const {successResponse} = require("../utils/response");

exports.getBarbers = async (req,res,next) => {
    const data = await barbersServices.getBarbers(req.query?.name);
    successResponse(res,data);
};

exports.getBarberById = async (req,res,next) => {
    const {id} = req.params;
    const data = await barbersServices.getBarberById(id);
    successResponse(res,data,"Barber found successfully.");
};

exports.createBarber = async (req, res, next) => {
    const data = await barbersServices.createBarber(req.body, req.files);
    successResponse(res, data, "Barber successfully added!");
  };
  
  exports.updateBarber = async (req, res, next) => {
    const { id } = req.params;
    const data = await barbersServices.updateBarber(id, req.body, req.files);
    successResponse(res, data, "Barber successfully updated!");
  };
  
  exports.deleteBarberById = async (req, res, next) => {
    const { id } = req.params;
    const data = await barbersServices.deleteBarberById(id);
    successResponse(res, data, "Barber successfully deleted!");
  };
  