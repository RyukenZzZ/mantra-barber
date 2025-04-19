const ProductRepository = require("../repositories/products");
const { imageUpload } = require("../utils/image-kit");
const { NotFoundError, InternalServerError } = require("../utils/request");

exports.getProducts = async (name) => {
  const Products = await ProductRepository.getProducts(name);
  if (Products.length === 0) {
    throw new NotFoundError("No Products found with the given criteria!");
  }
  return Products;
};

exports.getProductById = async (id) => {
  const Product = await ProductRepository.getProductById(id);
  if (!Product) {
    throw new NotFoundError("Product not found!");
  }
  return Product;
};

exports.createProduct = async (data, file) => {
  // Upload file to image kit
  if (file?.image_url) {
    data.image_url = await imageUpload(file.image_url);
  }

  // Create the data
  return ProductRepository.createProduct(data);
};

exports.updateProduct = async (id, data, file) => {
  const existingProduct = await ProductRepository.getProductById(id);
  if (!existingProduct) {
    throw new NotFoundError("Product not found!");
  }

  // replicated existing data with new data
  data = {
    ...existingProduct, // existing Student
    ...data,
  };

  // Upload file to image kit
  if (file?.image_url) {
    data.image_url = await imageUpload(file.image_url);
  }

  const updatedProduct = await ProductRepository.updateProduct(id, data);
  if (!updatedProduct) {
    throw new InternalServerError("Failed to update the Product!");
  }

  return updatedProduct;
};

exports.deleteProductById = async (id) => {
  const existingProduct = await ProductRepository.getProductById(id);
  if (!existingProduct) {
    throw new NotFoundError("Product not found!");
  }

  const deletedProduct = await ProductRepository.deleteProductById(id);
  if (!deletedProduct) {
    throw new InternalServerError("Failed to delete the Product!");
  }

  return deletedProduct;
};
