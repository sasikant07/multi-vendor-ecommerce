const formidable = require("formidable");
const { responseReturn } = require("../../utils/response");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");

class ProductController {
  // Add a product
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

  // Get All Products
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
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Get a single product with ProductID
  get_product = async (req, res) => {
    const { productId } = req.params;

    try {
      const product = await productModel.findById(productId);
      responseReturn(res, 200, { product });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Update an existing Product
  update_product = async (req, res) => {
    let { name, description, discount, price, stock, brand, productId } =
      req.body;
    name = name.trim();
    const slug = name.split(" ").join("-");

    try {
      await productModel.findByIdAndUpdate(productId, {
        name,
        description,
        discount,
        price,
        stock,
        brand,
        productId,
        slug,
      });

      const product = await productModel.findById(productId);
      responseReturn(res, 200, {
        product,
        message: "Product updated successfully!",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  update_product_image = async (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      const { productId, oldImage } = fields;
      const { newImage } = files;

      if (err) {
        responseReturn(res, 404, { error: err.message });
      } else {
        try {
          cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true,
          });
          const result = await cloudinary.uploader.upload(
            newImage[0].filepath,
            {
              folder: "products",
            }
          );

          if (result) {
            let { images } = await productModel.findById(productId);
            const index = images.findIndex((img) => img === oldImage[0]);
            images[index] = result.url;

            await productModel.findByIdAndUpdate(productId, {
              images,
            });
            const product = await productModel.findById(productId);
            responseReturn(res, 200, {
              product,
              message: "Product images updated successfully!",
            });
          } else {
            responseReturn(res, 500, { error: "Image upload failed!" });
          }
        } catch (error) {
          responseReturn(res, 404, { error: error.message });
        }
      }
    });
  };
}

module.exports = new ProductController();
