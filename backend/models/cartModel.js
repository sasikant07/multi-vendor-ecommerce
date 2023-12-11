const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId, // Join users documents in mongoose
      required: true,
    },
    productId: {
      type: Schema.ObjectId, // Join products document
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("cartProducts", cartSchema);
