const router = require("express").Router();

const cartController = require("../../controllers/home/cartControllers");

router.post("/home/product/add-to-cart", cartController.add_to_cart);
router.get(
  "/home/product/get-cart-products/:userId",
  cartController.get_cart_products
);
router.delete(
  "/home/product/delete-cart-products/:cart_id",
  cartController.delete_cart_product
);
router.put("/home/product/quantity-inc/:cart_id", cartController.quantity_inc);

module.exports = router;
