const router = require("express").Router();
const ChatController = require("../controllers/chat/ChatController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post(
  "/chat/customer/add-customer-friend",
  ChatController.add_customer_friend
);
router.post(
  "/chat/customer/send-message-to-seller",
  ChatController.customer_message_send
);
router.get(
  "/chat/seller/get-customers/:sellerId",
  ChatController.get_customers
);
router.get(
  "/chat/seller/get-customer-seller-message/:customerId",
  authMiddleware,
  ChatController.get_customer_seller_message
);
router.post(
  "/chat/seller/send-message-to-customer",
  authMiddleware,
  ChatController.send_seller_message
);

module.exports = router;
