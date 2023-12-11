const {
  mongo: { ObjectId },
} = require("mongoose");
const { responseReturn } = require("../../utils/response");
const cartModel = require("../../models/cartModel");

class CartController {
  add_to_cart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
      const product = await cartModel.findOne({
        $and: [
          {
            productId: {
              $eq: productId,
            },
          },
          {
            userId: {
              $eq: userId,
            },
          },
        ],
      });

      if (product) {
        responseReturn(res, 404, { message: "Product already added to cart" });
      } else {
        const product = await cartModel.create({
          userId,
          productId,
          quantity,
        });

        responseReturn(res, 201, { message: "Product added to cart", product });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_cart_products = async (req, res) => {
    const co = 5; // Platform fees
    const { userId } = req.params;
    try {
      const cart_products = await cartModel.aggregate([
        // Join Products documents with Cart Products Documents
        {
          $match: {
            userId: {
              $eq: new ObjectId(userId),
            },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "products", // products: [ [ObjectId] ]
          },
        },
      ]);

      let calculatePrice = 0;
      let cart_product_count = 0;
      const outOfStockProduct = cart_products.filter(
        (p) => p.products[0].stock < p.quantity
      );

      for (let i = 0; i < outOfStockProduct.length; i++) {
        cart_product_count = cart_product_count + outOfStockProduct[i].quantity;
      }

      const stockProduct = cart_products.filter(
        (p) => p.products[0].stock >= p.quantity
      );

      for (let i = 0; i < stockProduct.length; i++) {
        const { quantity } = stockProduct[i];
        cart_product_count = cart_product_count + quantity;
        const { price, discount } = stockProduct[i].products[0];
        if (discount !== 0) {
          calculatePrice =
            calculatePrice +
            quantity * (price - Math.floor((price * discount) / 100));
        } else {
          calculatePrice = calculatePrice + quantity * price;
        }
      }
      let p = [];
      let unique = [
        ...new Set(stockProduct.map((p) => p.products[0].sellerId.toString())),
      ];

      // show product as per the different seller in cart page
      for (let i = 0; i < unique.length; i++) {
        let price = 0;
        for (let j = 0; j < stockProduct.length; j++) {
          const tempProduct = stockProduct[j].products[0];
          if (unique[j] === tempProduct.sellerId.toString()) {
            let pri = 0;
            if (tempProduct.discount !== 0) {
              pri =
                tempProduct.price -
                Math.floor((tempProduct.price * tempProduct.discount) / 100);
            } else {
              pri = tempProduct.price;
            }
            pri = pri - Math.floor((pri * co) / 100);
            price = price + pri * stockProduct[j].quantity;
            p[i] = {
              sellerId: unique[i],
              shopName: tempProduct.shopName,
              price,
              products: p[i]
                ? [
                    ...p[i].products,
                    {
                      _id: stockProduct[j]._id,
                      quantity: stockProduct[j].quantity,
                      productInfo: tempProduct,
                    },
                  ]
                : [
                    {
                      _id: stockProduct[j]._id,
                      quantity: stockProduct[j].quantity,
                      productInfo: tempProduct,
                    },
                  ],
            };
          }
        }
      }
      
    } catch (error) {}
  };
}

module.exports = new CartController();