const categoryModel = require("../../models/categoryModel");
const formidable = require("formidable"); // to handle the FormData from frontend instead of req.body
const { responseReturn } = require("../../utils/response");
const cloudinary = require("cloudinary").v2;

class CategoryController {
  add_category = async (req, res) => {
    const form = new formidable.IncomingForm(); // to handle the FormData from frontend instead of req.body
    form.parse(req, async (err, fileds, files) => {
      if (err) {
        responseReturn(res, 404, { error: "Something went wrong" });
      } else {
        let { name } = fileds;
        let { image } = files;
        name = name[0].trim();

        const slug = name.split(" ").join("-");

        cloudinary.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.API_KEY,
          api_secret: process.env.API_SECRET,
          secure: true,
        });

        try {
          const result = await cloudinary.uploader.upload(image[0].filepath, {
            folder: "categories",
          });

          if (result) {
            const category = await categoryModel.create({
              name,
              slug,
              image: result.url,
            });
            responseReturn(res, 201, {
              category,
              message: "Category added successfully!",
            });
          } else {
            responseReturn(res, 404, { error: "Image upload failed!" });
          }
        } catch (error) {
          responseReturn(res, 500, { error: "Internal server error" });
        }
      }
    });
  };
  get_category = async (req, res) => {
    const { page, perPage, searchValue } = req.query;
    const skipPage = parseInt(perPage) * (parseInt(page) - 1); // 1 * (1-1) = 0

    try {
      if (searchValue) {
        const categories = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });

        const totalCategory = await categoryModel
          .find({ $text: { $search: searchValue } })
          .countDocuments();

        responseReturn(res, 200, {
          totalCategory,
          categories,
        });
      } else {
        const categories = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });
      }
      const totalCategory = await categoryModel.find({}).countDocuments();

      responseReturn(res, 200, {
        totalCategory,
        categories,
      });
    } catch (error) {
      responseReturn(res, 500, { error: "Internal server error" });
    }
  };
}

module.exports = new CategoryController();
