const { Schema, model } = require("mongoose");

const sellerCustomer = new Schema(
  {
    myId: {
      type: String,
      required: true,
    },
    myFriends: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

module.exports = model("seller_customers", sellerCustomer);
