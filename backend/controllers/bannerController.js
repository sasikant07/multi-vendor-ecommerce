const { responseReturn } = require("../utils/response");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const productModel = require("../models/productModel");
const bannerModel = require("../models/bannerModel");
const {
  mongo: { ObjectId },
} = require("mongoose");

class BannerController {
  add_banner = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 400, { error: "Something went wrong" });
      } else {
        const { productId } = fields;
        const { image } = files;

        cloudinary.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.API_KEY,
          api_secret: process.env.API_SECRET,
          secure: true,
        });

        try {
          const { slug } = await productModel.findById(productId);

          const result = await cloudinary.uploader.upload(image[0].filepath, {
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

  get_banner = async (req, res) => {
    const { productId } = req.params;

    try {
      const banner = await bannerModel.findOne({
        productId: new ObjectId(productId),
      });

      responseReturn(res, 200, { banner });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_banners = async (req, res) => {
    try {
      const banners = await bannerModel.aggregate([
        {
          $sample: {
            size: 10,
          },
        },
      ]);

      responseReturn(res, 200, { banners });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  update_banner = async (req, res) => {
    const { bannerId } = req.params;

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, _, files) => {
      const { image } = files;

      try {
        let banner = await bannerModel.findById(bannerId);

        let temp = banner.banner.split("/");
        temp = temp[temp.length - 1];
        const imageName = temp.split(".")[0];

        cloudinary.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.API_KEY,
          api_secret: process.env.API_SECRET,
          secure: true,
        });

        await cloudinary.uploader.destroy(imageName);

        const { url } = await cloudinary.uploader.upload(image[0].filepath, {
          folder: "Banners",
        });

        banner = await bannerModel.findByIdAndUpdate(bannerId, {
          banner: url,
        });

        responseReturn(res, 200, {
          banner,
          message: "Banner Updated Successfully",
        });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };
}

module.exports = new BannerController();
