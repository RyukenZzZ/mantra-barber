const { PrismaClient } = require("@prisma/client");
const JSONBigInt = require("json-bigint");

const prisma = new PrismaClient();

exports.getServices = async (name) => {
  // Filter berdasarkan name jika ada
  const filter = name
    ? {
        where: {
          name: {
            contains: name,
            mode: "insensitive", // agar pencarian tidak case-sensitive
          },
        },
      }
    : {};

  const services = await prisma.services.findMany(filter);
  const serializedData = JSONBigInt.stringify(services);
  return JSONBigInt.parse(serializedData);
};

exports.getServiceById = async (id) => {
  const service = await prisma.services.findUnique({
    where: { id },
  });
  const serializedData = JSONBigInt.stringify(service);
  return JSONBigInt.parse(serializedData);
};

exports.createService = async (data) => {
  const newService = await prisma.services.create({
    data,
  });
  const serializedData = JSONBigInt.stringify(newService);
  return JSONBigInt.parse(serializedData);
};

exports.updateService = async (id, data) => {
  const updatedService = await prisma.services.update({
    where: {
      id: Number(id),
    },
    data,
  });
  const serializedData = JSONBigInt.stringify(updatedService);
  return JSONBigInt.parse(serializedData);
};

exports.deleteServiceById = async (id) => {
  const deletedService = await prisma.services.delete({
    where: {
      id: Number(id),
    },
  });
  const serializedData = JSONBigInt.stringify(deletedService);
  return JSONBigInt.parse(serializedData);
};
