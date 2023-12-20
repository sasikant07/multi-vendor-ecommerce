const router = require("express").Router();

const homeControllers = require("../../controllers/home/homeControllers");

router.get("/get-categories", homeControllers.get_categories);
router.get("/get-products", homeControllers.get_products);
router.get("/price-range-latest-product", homeControllers.price_range_product);
router.get("/query-products", homeControllers.query_products);
router.get("/get-product/:slug", homeControllers.get_product);
router.post("/customer/customer-review", homeControllers.customer_review);
router.get("/customer/get-reviews/:productId", homeControllers.get_reviews);

module.exports = router;
