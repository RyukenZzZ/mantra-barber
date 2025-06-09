const BarberRepository = require("../repositories/barbers");
const { imageUpload } = require("../utils/image-kit");
const { NotFoundError, InternalServerError } = require("../utils/request");

exports.getBarbers = async (name) => {
  const Barbers = await BarberRepository.getBarbers(name);
  if (Barbers.length === 0) {
    throw new NotFoundError("No Barbers found with the given criteria!");
  }
  return Barbers;
};

exports.getBarberById = async (id) => {
  const Barber = await BarberRepository.getBarberById(id);
  if (!Barber) {
    throw new NotFoundError("Barber not found!");
  }
  return Barber;
};

exports.createBarber = async (data, file) => {
  // Upload file to image kit
  if (file?.photo_url) {
    data.photo_url = await imageUpload(file.photo_url);
  }

  // Create the data
  return BarberRepository.createBarber(data);
};

exports.updateBarber = async (id, data, file) => {
  const existingBarber = await BarberRepository.getBarberById(id);
  if (!existingBarber) {
    throw new NotFoundError("Barber not found!");
  }

  // replicated existing data with new data
  data = {
    ...existingBarber, // existing Student
    ...data,
  };

  // Upload file to image kit
  if (file?.photo_url) {
    data.photo_url = await imageUpload(file.photo_url);
  }

  const updatedBarber = await BarberRepository.updateBarber(id, data);
  if (!updatedBarber) {
    throw new InternalServerError("Failed to update the Barber!");
  }

  return updatedBarber;
};

exports.deleteBarberById = async (id) => {
  const existingBarber = await BarberRepository.getBarberById(id);
  if (!existingBarber) {
    throw new NotFoundError("Barber not found!");
  }

  const deletedBarber = await BarberRepository.deleteBarberById(id);
  if (!deletedBarber) {
    throw new InternalServerError("Failed to delete the Barber!");
  }

  return deletedBarber;
};

exports.updateManyBarbers = async (resetDate) => {
  const updatedBarber = await BarberRepository.updateManyBarbers(resetDate);
  if (!updatedBarber) {
    throw new InternalServerError("Failed to updateMany the Barber!");
  }

  return updatedBarber;
};