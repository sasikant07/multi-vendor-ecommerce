const router = require("express").Router();
const sellerController = require("../../controllers/dashboard/sellerController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

router.get("/request-seller-get", authMiddleware, sellerController.get_seller_request);

module.exports = router;
