const formidable = require("formidable");
const { responseReturn } = require("../../utils/response");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");

class ProductController {
  add_product = async (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true }); // to handle the FormData from frontend instead of req.body
    const {id} = req;

    form.parse(req, async (err, fields, files) => {
      let { name, category, description, price, discount, stock, brand, shopName } = fields;
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

      } catch (error) {
        responseReturn(res, 500, { error: "Internal Server Error" });
      }
    });
  };
}

module.exports = new ProductController();
