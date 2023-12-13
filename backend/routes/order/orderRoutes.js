const router = require("express").Router();

const orderController = require("../../controllers/order/orderControllers");

router.post("/home/order/place-order", orderController.place_order);

module.exports = router;
