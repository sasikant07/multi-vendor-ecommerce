const router = require("express").Router();

const orderController = require("../../controllers/order/orderControllers");

router.post("/home/order/place-order", orderController.place_order);
router.get(
  "/home/customer/get-dashboard-data/:userId",
  orderController.get_customer_dashboard_data
);

module.exports = router;
