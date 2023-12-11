const router = require("express").Router();

const cartController = require("../../controllers/home/cartControllers");

router.post("/home/product/add-to-cart", cartController.add_to_cart);
router.get(
  "/home/product/get-cart-products/:userId",
  cartController.get_cart_products
);

module.exports = router;
