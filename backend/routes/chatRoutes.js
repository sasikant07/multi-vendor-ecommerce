const router = require("express").Router();
const ChatController = require("../controllers/chat/ChatController");

router.post(
  "/chat/customer/add-customer-friend",
  ChatController.add_customer_friend
);
router.post(
  "/chat/customer/send-message-to-seller",
  ChatController.customer_message_send
);

module.exports = router;
