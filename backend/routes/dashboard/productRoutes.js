const router = require("express").Router();
const productController = require("../../controllers/dashboard/productController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

router.post("/product-add", authMiddleware, productController.add_product);
router.get("/product-get", authMiddleware, productController.get_products);

module.exports = router;
