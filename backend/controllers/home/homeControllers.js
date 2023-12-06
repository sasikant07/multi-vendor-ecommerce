const categoryModel = require("../../models/categoryModel");
const { responseReturn } = require("../../utils/response");

class HomeControllers {
  get_categories = async (req, res) => {
    try {
      const categories = await categoryModel.find({});
      responseReturn(res, 200, { categories });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new HomeControllers();
