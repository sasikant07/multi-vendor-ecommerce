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
router.put("/home/product/quantity-dec/:cart_id", cartController.quantity_dec);
router.post("/home/product/add-to-wishlist", cartController.add_to_wishlist);
router.get(
  "/home/product/get-wishlist-products/:userId",
  cartController.get_wishlist_products
);
router.delete(
  "/home/product/delete-wishlist-product/:wishlistId",
  cartController.remove_wishlist_product
);

module.exports = router;
