const router = require("express").Router();

const orderController = require("../../controllers/order/orderControllers");

router.post("/home/order/place-order", orderController.place_order);
router.get(
  "/home/customer/get-dashboard-data/:userId",
  orderController.get_customer_dashboard_data
);
router.get(
  "/home/customer/get-orders/:customerId/:status",
  orderController.get_orders
);
router.get("/home/customer/get-order/:orderId", orderController.get_order);

// admin API's
router.get("/admin/orders", orderController.get_admin_orders);
router.get("/admin/order/:orderId", orderController.get_admin_order);

module.exports = router;
