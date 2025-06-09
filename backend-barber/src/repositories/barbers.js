const { PrismaClient } = require("@prisma/client");
const JSONBigInt = require("json-bigint");
const { BadRequestError } = require("../utils/request");

const prisma = new PrismaClient();

exports.getBarbers = async (name) => {
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

  const Barbers = await prisma.barbers.findMany(filter);
  const serializedData = JSONBigInt.stringify(Barbers);
  return JSONBigInt.parse(serializedData);
};

exports.getBarberById = async (id) => {
  const Barber = await prisma.barbers.findUnique({
    where: { id },
  });
  const serializedData = JSONBigInt.stringify(Barber);
  return JSONBigInt.parse(serializedData);
};

exports.createBarber = async (data) => {
  const newBarber = await prisma.barbers.create({
    data,
  });
  const serializedData = JSONBigInt.stringify(newBarber);
  return JSONBigInt.parse(serializedData);
};

exports.updateBarber = async (id, data) => {
  const updatedBarber = await prisma.barbers.update({
    where: {
      id: Number(id),
    },
    data,
  });
  const serializedData = JSONBigInt.stringify(updatedBarber);
  return JSONBigInt.parse(serializedData);
};

exports.deleteBarberById = async (id) => {
  const deletedBarber = await prisma.barbers.delete({
    where: {
      id: Number(id),
    },
  });
  const serializedData = JSONBigInt.stringify(deletedBarber);
  return JSONBigInt.parse(serializedData);
};

exports.updateManyBarbers = async (resetDate) => {
  if (!resetDate) {
    throw new BadRequestError("reset_count_from harus disediakan");
  }

  const updatedData= await prisma.barbers.updateMany({
    where: {},
    data: {
      reset_count_from: new Date(resetDate)
    }
  });

  const serializedData = JSONBigInt.stringify(updatedData);
  return JSONBigInt.parse(serializedData);
};