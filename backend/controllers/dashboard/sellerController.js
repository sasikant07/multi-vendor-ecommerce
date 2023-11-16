const sellerModel = require("../../models/sellerModel");
const { responseReturn } = require("../../utils/response");

class SellerController {
  get_seller_request = async (req, res) => {
    const { page, perPage, searchValue } = req.query;
    const skipPage = parseInt(perPage) * (parseInt(page) - 1);

    try {
      if (searchValue) {
      } else {
        const seller = await sellerModel
          .find({ status: "pending" })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });

        const totalSeller = await sellerModel
          .find({ status: "pending" })
          .countDocuments();

        responseReturn(res, 200, {
          totalSeller,
          seller,
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new SellerController();
