const express = require("express");
const {authorization} = require("../middlewares/auth");
const {adminRole, userRole} = require("../constants/auth");
const {
    validateGetProducts,
    validateGetProductById,
    validateCreateProduct,
    validateUpdateProduct,
    validateDeleteProductById,
} = require ("../middlewares/products");
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProductById,
} = require("../controllers/products");

const router = express.Router();

router
.route("/")
.get(validateGetProducts,getProducts)
.post(authorization(adminRole),validateCreateProduct,createProduct);

router
.route("/:id")
.get(validateGetProductById,getProductById)
.put(authorization(adminRole),validateUpdateProduct,updateProduct)
.delete(authorization(adminRole),validateDeleteProductById,deleteProductById);

module.exports = router;