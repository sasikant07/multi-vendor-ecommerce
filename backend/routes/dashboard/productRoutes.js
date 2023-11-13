const router = require("express").Router();
const productController = require("../../controllers/dashboard/productController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

router.post("/product-add", authMiddleware, productController.add_product);
// router.get("/category-get", authMiddleware, categoryController.get_category);

module.exports = router;
