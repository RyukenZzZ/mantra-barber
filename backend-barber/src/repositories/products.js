const { PrismaClient } = require("@prisma/client");
const JSONBigInt = require("json-bigint");

const prisma = new PrismaClient();

exports.getProducts = async (name) => {
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

  const Products = await prisma.products.findMany(filter);
  const serializedData = JSONBigInt.stringify(Products);
  return JSONBigInt.parse(serializedData);
};

exports.getProductById = async (id) => {
  const Product = await prisma.products.findUnique({
    where: { id },
  });
  const serializedData = JSONBigInt.stringify(Product);
  return JSONBigInt.parse(serializedData);
};

exports.createProduct = async (data) => {
  const newProduct = await prisma.products.create({
    data,
  });
  const serializedData = JSONBigInt.stringify(newProduct);
  return JSONBigInt.parse(serializedData);
};

exports.updateProduct = async (id, data) => {
  const updatedProduct = await prisma.products.update({
    where: {
      id: Number(id),
    },
    data,
  });
  const serializedData = JSONBigInt.stringify(updatedProduct);
  return JSONBigInt.parse(serializedData);
};

exports.deleteProductById = async (id) => {
  const deletedProduct = await prisma.products.delete({
    where: {
      id: Number(id),
    },
  });
  const serializedData = JSONBigInt.stringify(deletedProduct);
  return JSONBigInt.parse(serializedData);
};
