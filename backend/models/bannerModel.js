const { Schema, model } = require("mongoose");

const bannerSchema = new Schema({
  productId: {
    type: Schema.ObjectId,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
});

module.exports = model("banners", bannerSchema);
