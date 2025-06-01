const { PrismaClient } = require("@prisma/client");
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/library");
const JSONBigInt = require("json-bigint");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { BadRequestError } = require("../utils/request");

const prisma = new PrismaClient();

exports.createUser = async (data) => {
    //encrypt password
    data.password = await bcrypt.hash(data.password,10);

     return prisma.users.create({ data })
    .then((user) => {
      const serialized = JSONBigInt.stringify(user);
      return JSONBigInt.parse(serialized);
    })
    .catch((err) => {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === "P2002" &&
        err.meta?.target?.includes("email")
      ) {
        throw new BadRequestError("Email sudah terdaftar");
      }

      throw err; // lempar error lainnya ke express-async-errors
    });
};

exports.getUserByEmail = async (email) => {
    const user = await prisma.users.findFirst({
        where: {
            email,
        },
    });

    // Convert BigInt fields to string for safe serialization
    const serializedStudents = JSONBigInt.stringify(user);
    return JSONBigInt.parse(serializedStudents);
};

exports.getUserById = async (id) => {
    const user = await prisma.users.findFirst({
        where: {
            id,
        },
    });

    // Convert BigInt fields to string for safe serialization
    const serializedStudents = JSONBigInt.stringify(user);
    return JSONBigInt.parse(serializedStudents);
};

exports.googleLogin = async (accessToken) => {
    const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    )
    return response?.data;
}

exports.updateUser = async (id, data) => {
  try {
    const updated = await prisma.users.update({
      where: { id },
      data,
    });

    const serialized = JSONBigInt.stringify(updated);
    return JSONBigInt.parse(serialized);
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2002' &&
      err.meta?.target?.includes('email')
    ) {
      throw new BadRequestError('Email sudah terdaftar');
    }
    throw err;
  }
};