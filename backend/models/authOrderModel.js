const { Schema, model } = require("mongoose");

const authOrderSchema = new Schema(
  {
    orderId: {
      type: Schema.ObjectId, // Join users documents in mongoose
      required: true,
    },
    sellerId: {
      type: Schema.ObjectId, // Join users documents in mongoose
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
    shippingInfo: {
      type: String,
      required: true,
    },
    delivery_status: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("authOrders", authOrderSchema);
