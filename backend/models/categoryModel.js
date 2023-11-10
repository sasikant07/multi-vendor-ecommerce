const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexing to search category by name
categorySchema.index({
  name: "text",
});

module.exports = model("categories", categorySchema);
