const serviceRepository = require("../repositories/services");
const { NotFoundError, InternalServerError } = require("../utils/request");

exports.getServices = async (name) => {
  const services = await serviceRepository.getServices(name);
  if (services.length === 0) {
    throw new NotFoundError("No Services found with the given criteria!");
  }
  return services;
};

exports.getServiceById = async (id) => {
  const service = await serviceRepository.getServiceById(id);
  if (!service) {
    throw new NotFoundError("Service not found!");
  }
  return service;
};

exports.createService = async (data) => {
  return serviceRepository.createService(data);
};

exports.updateService = async (id, data) => {
  const existingService = await serviceRepository.getServiceById(id);
  if (!existingService) {
    throw new NotFoundError("Service not found!");
  }

  const updatedService = await serviceRepository.updateService(id, data);
  if (!updatedService) {
    throw new InternalServerError("Failed to update the Service!");
  }

  return updatedService;
};

exports.deleteServiceById = async (id) => {
  const existingService = await serviceRepository.getServiceById(id);
  if (!existingService) {
    throw new NotFoundError("Service not found!");
  }

  const deletedService = await serviceRepository.deleteServiceById(id);
  if (!deletedService) {
    throw new InternalServerError("Failed to delete the Service!");
  }

  return deletedService;
};
