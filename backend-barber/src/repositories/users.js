const { PrismaClient } = require("@prisma/client");
const JSONBigInt = require("json-bigint");
const bcrypt = require("bcrypt");
const axios = require("axios");

const prisma = new PrismaClient();

exports.createUser = async (data) => {
    //encrypt password
    data.password = await bcrypt.hash(data.password,10);

    //create new user
    const newUser = await prisma.users.create({
        data,
    });

    // Convert BigInt fields to string for safe serialization
    const serializedUsers = JSONBigInt.stringify(newUser);
    return JSONBigInt.parse(serializedUsers);
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