const productsServices = require("../services/products");
const {successResponse} = require("../utils/response");

exports.getProducts = async (req,res,next) => {
    const data = await productsServices.getProducts(req.query?.name);
    successResponse(res,data);
};

exports.getProductById = async (req,res,next) => {
    const {id} = req.params;
    const data = await productsServices.getProductById(id);
    successResponse(res,data,"Product found successfully.");
};

exports.createProduct = async (req, res, next) => {
    const data = await productsServices.createProduct(req.body, req.files);
    successResponse(res, data, "Product successfully added!");
  };
  
  exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const data = await productsServices.updateProduct(id, req.body, req.files);
    successResponse(res, data, "Product successfully updated!");
  };
  
  exports.deleteProductById = async (req, res, next) => {
    const { id } = req.params;
    const data = await productsServices.deleteProductById(id);
    successResponse(res, data, "Product successfully deleted!");
  };
  