const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const { responseReturn } = require("../../utils/response");
const QueryProducts = require("../../utils/queryProducts");

class HomeControllers {
  formatProduct = (products) => {
    const productArray = [];
    let i = 0;
    while (i < products.length) {
      let temp = [];
      let j = i;
      while (j < i + 3) {
        if (products[j]) {
          temp.push(products[j]);
        }
        j++;
      }
      productArray.push([...temp]);
      i = j;
    }
    return productArray;
  };

  get_categories = async (req, res) => {
    try {
      const categories = await categoryModel.find({});
      responseReturn(res, 200, { categories });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_products = async (req, res) => {
    try {
      const products = await productModel
        .find({})
        .limit(16)
        .sort({ createdAt: -1 });

      const allProduct1 = await productModel
        .find({})
        .limit(9)
        .sort({ createdAt: -1 });
      const latest_product = this.formatProduct(allProduct1);

      const allProduct2 = await productModel
        .find({})
        .limit(9)
        .sort({ rating: -1 });
      const topRated_product = this.formatProduct(allProduct2);

      const allProduct3 = await productModel
        .find({})
        .limit(9)
        .sort({ discount: -1 });
      const discount_product = this.formatProduct(allProduct3);

      responseReturn(res, 200, {
        products,
        latest_product,
        topRated_product,
        discount_product,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  price_range_product = async (req, res) => {
    try {
      const priceRange = {
        low: 0,
        high: 0,
      };

      const products = await productModel
        .find({})
        .limit(9)
        .sort({ createdAt: -1 });
      const latest_product = this.formatProduct(products);

      const getForPrice = await productModel.find({}).sort({ price: 1 });

      if (getForPrice.length > 0) {
        priceRange.high = getForPrice[getForPrice.length - 1].price;
        priceRange.low = getForPrice[0].price;
      }

      responseReturn(res, 200, {
        latest_product,
        priceRange,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  query_products = async (req, res) => {
    const perPage = 12; // 12 products per page
    req.query.perPage = perPage;
    try {
      const products = await productModel.find({}).sort({ createdAt: -1 });

      const totalProduct = new QueryProducts(products, req.query)
        .categoryQuery()
        .priceQuery()
        .ratingQuery()
        .sortByPriceQuery()
        .countProducts();

      const result = new QueryProducts(products, req.query)
        .categoryQuery()
        .ratingQuery()
        .priceQuery()
        .sortByPriceQuery()
        .skipQuery()
        .limitQuery()
        .getProducts();

      responseReturn(res, 200, { products: result, totalProduct });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new HomeControllers();
