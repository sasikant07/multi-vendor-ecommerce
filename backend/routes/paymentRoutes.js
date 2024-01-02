const router = require("express").Router();
const paymentController = require("../controllers/payment/paymentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get(
  "/payment/create-stripe-connect-account",
  authMiddleware,
  paymentController.create_stripe_connect_account
);
router.put(
  "/payment/active-stripe-connect-account/:activeCode",
  authMiddleware,
  paymentController.active_stripe_connect_account
);
router.get(
  "/payment/seller-payment-details/:sellerId",
  authMiddleware,
  paymentController.get_admin_payment_details
);
router.post(
  "/payment/widthdrawl-request",
  authMiddleware,
  paymentController.send_withdrawl_request
);

module.exports = router;
