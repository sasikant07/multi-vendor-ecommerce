const { responseReturn } = require("../utils/response");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const productModel = require("../models/productModel");
const bannerModel = require("../models/bannerModel");

class BannerController {
  add_banner = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 400, { error: "Something went wrong" });
      } else {
        const { productId } = fields;
        const { banner } = files;

        cloudinary.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.API_KEY,
          api_secret: process.env.API_SECRET,
          secure: true,
        });

        try {
          const { slug } = await productModel.findById(productId);

          const result = await cloudinary.uploader.upload(banner[0].filepath, {
            folder: "Banners",
          });

          const banners = await bannerModel.create({
            productId,
            banner: result.url,
            link: slug,
          });

          responseReturn(res, 200, {
            banners,
            message: "Banner uploaded successfully",
          });
        } catch (error) {
          responseReturn(res, 500, { error: error.message });
        }
      }
    });
  };
}

module.exports = new BannerController();
