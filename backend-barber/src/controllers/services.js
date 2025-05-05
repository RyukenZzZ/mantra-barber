const serviceService = require("../services/services");
const {successResponse} = require("../utils/response");

exports.getServices = async (req,res,next) => {
    const data = await serviceService.getServices(req.query?.name);
    successResponse(res,data);
};

exports.getServiceById = async (req,res,next) => {
    const {id} = req.params;
    const data = await serviceService.getServiceById(id);
    successResponse(res,data,"service found successfully.");
};

exports.createService = async (req, res, next) => {
    const data = await serviceService.createService(req.body,req.files);
    successResponse(res, data, "Service successfully added!");
  };
  
  exports.updateService = async (req, res, next) => {
    const { id } = req.params;
    const data = await serviceService.updateService(id, req.body,req.files);
    successResponse(res, data, "Service successfully updated!");
  };
  
  exports.deleteServiceById = async (req, res, next) => {
    const { id } = req.params;
    const data = await serviceService.deleteServiceById(id);
    successResponse(res, data, "Service successfully deleted!");
  };
  