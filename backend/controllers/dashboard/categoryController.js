const categoryModel = require("../../models/categoryModel");
const formidable = require("formidable");
const { responseReturn } = require("../../utils/response");
const cloudinary = require("cloudinary").v2;

class CategoryController {
  add_category = async (req, res) => {
    const form = new formidable.IncomingForm(); // to handle the FormData from frontend instead of req.body
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "Something went wrong" });
      } else {
        let { name } = fields;
        let { image } = files;
        name = name[0].trim();

        const slug = name.split(" ").join("-");

        cloudinary.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.API_KEY,
          api_secret: process.env.API_SECRET,
          secure: true,
        });

        console.log("===CN====", process.env.CLOUD_NAME);
        console.log("===AK====", process.env.API_KEY);
        console.log("===AS====", process.env.API_SECRET);

        console.log("===NAME===", name);
        console.log("===IMAGES===", image[0].filepath);
        console.log("===SLUG===", slug);

        try {
            console.log("=========================", cloudinary.v2.uploader.upload(image[0].filepath, { folder: 'categorys' }, (error, result)=>{
                console.log(result, error);
              }));
          const result = await cloudinary.v2.uploader.upload(image[0].filepath, { folder: 'categorys' });

          console.log("==RESULT=====", result);

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
  get_category = async (req, res) => {};
}

module.exports = new CategoryController();
