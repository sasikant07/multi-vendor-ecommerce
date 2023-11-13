const formidable = require("formidable");
const { responseReturn } = require("../../utils/response");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");

class ProductController {
  add_product = async (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true }); // to handle the FormData from frontend instead of req.body
    const { id } = req;

    form.parse(req, async (err, fields, files) => {
      let {
        name,
        category,
        description,
        price,
        discount,
        stock,
        brand,
        shopName,
      } = fields;
      const { images } = files;

      name = name[0].trim();

      const slug = name.split(" ").join("-");

      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
        secure: true,
      });

      try {
        let allImageUrl = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.uploader.upload(images[i].filepath, {
            folder: "products",
          });
          allImageUrl = [...allImageUrl, result.url];
        }

        const product = await productModel.create({
          sellerId: id,
          name,
          slug,
          category: category[0].trim(),
          description: description[0].trim(),
          brand: brand[0].trim(),
          stock: parseInt(stock),
          price: parseInt(price),
          discount: parseInt(discount),
          shopName: shopName[0].trim(),
          images: allImageUrl,
        });

        responseReturn(res, 201, {
          product,
          message: "Product added successfully",
        });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  get_products = async (req, res) => {
    const { page, perPage, searchValue } = req.query;
    const { id } = req;

    const skipPage = parseInt(perPage) * (parseInt(page) - 1);

    try {
      if (searchValue) {
        const products = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });

        const totalProduct = await productModel
          .find({ $text: { $search: searchValue }, sellerId: id })
          .countDocuments();

        responseReturn(res, 200, {
          products,
          totalProduct,
        });
      } else {
        const products = await productModel
          .find({ sellerId: id })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({ sellerId: id })
          .countDocuments();

        responseReturn(res, 200, {
          totalProduct,
          products,
        });
      }
    } catch (error) {}
  };
}

module.exports = new ProductController();
