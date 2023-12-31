const moment = require("moment");
const {
  mongo: { ObjectId },
} = require("mongoose");
const { responseReturn } = require("../../utils/response");
const customerOrderModel = require("../../models/customerOrderModel");
const authOrderModel = require("../../models/authOrderModel");
const cartModel = require("../../models/cartModel");
const myShopWalletModel = require("../../models/myShopWalletModel");
const sellerWalletModel = require("../../models/sellerWalletModel");
const stripe = require("stripe")(
  "sk_test_51OTQNfCbH4s1f9nV6Ar9rB6RdS9FGNeWANBPI9FSkxjRyHVZ9gMjzGbCthrajPJ8bvRV6yA4R4UEls9V0NodYEQI00w0fBBd0Q"
);

class OrderController {
  paymentCheck = async (id) => {
    try {
      const order = await customerOrderModel.findById(id);
      if (order.payment_status === "unpaid") {
        await customerOrderModel.findByIdAndUpdate(id, {
          delivery_status: "cancelled",
        });
        await authOrderModel.updateMany(
          {
            orderId: id,
          },
          {
            delivery_status: "cancelled",
          }
        );
      }

      return true;
    } catch (error) {
      console.log(error.message);
    }
  };

  place_order = async (req, res) => {
    const { price, products, shipping_fee, shippingInfo, userId } = req.body;
    let authorOrderData = [];
    let cartId = [];
    const tempDate = moment(Date.now()).format("LLL");

    let customerOrderProduct = [];

    for (let i = 0; i < products.length; i++) {
      const pro = products[i].products;
      for (let j = 0; j < pro.length; j++) {
        let tempCusPro = pro[j].productInfo;
        tempCusPro.quantity = pro[j].quantity;
        customerOrderProduct.push(tempCusPro);

        if (pro[j]._id) {
          cartId.push(pro[j]._id);
        }
      }
    }
    try {
      const order = await customerOrderModel.create({
        customerId: userId,
        shippingInfo,
        products: customerOrderProduct,
        price: price + shipping_fee,
        delivery_status: "pending",
        payment_status: "unpaid",
        date: tempDate,
      });

      // To send different order according to different seller
      for (let i = 0; i < products.length; i++) {
        const pro = products[i].products;
        const pri = products[i].price;
        const sellerId = products[i].sellerId;
        let storePro = [];

        for (let j = 0; j < pro.length; j++) {
          let tempPro = pro[j].productInfo;
          tempPro.quantity = pro[j].quantity;
          storePro.push(tempPro);
        }
        authorOrderData.push({
          orderId: order.id,
          sellerId,
          products: storePro,
          price: pri,
          payment_status: "unpaid",
          shippingInfo: "#New York Warehouse",
          delivery_status: "Pending",
          date: tempDate,
        });
      }

      await authOrderModel.insertMany(authorOrderData);

      // To remove products after placed order successfully
      for (let k = 0; k < cartId.length; k++) {
        await cartModel.findByIdAndDelete(cartId[k]);
      }

      setTimeout(() => {
        this.paymentCheck(order.id);
      }, 15000);

      responseReturn(res, 201, {
        message: "Order placed successfully",
        orderId: order.id,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_customer_dashboard_data = async (req, res) => {
    const { userId } = req.params;
    try {
      const recentOrders = await customerOrderModel
        .find({
          customerId: new ObjectId(userId),
        })
        .limit(5);

      const totalOrder = await customerOrderModel
        .find({
          customerId: new ObjectId(userId),
        })
        .countDocuments();

      const pendingOrder = await customerOrderModel
        .find({
          customerId: new ObjectId(userId),
          delivery_status: "pending",
        })
        .countDocuments();

      const cancelledOrder = await customerOrderModel
        .find({
          customerId: new ObjectId(userId),
          delivery_status: "cancelled",
        })
        .countDocuments();

      responseReturn(res, 200, {
        recentOrders,
        pendingOrder,
        cancelledOrder,
        totalOrder,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_orders = async (req, res) => {
    const { customerId, status } = req.params;

    try {
      let orders = [];
      if (status !== "all") {
        orders = await customerOrderModel.find({
          customerId: new ObjectId(customerId),
          delivery_status: status,
        });
      } else {
        orders = await customerOrderModel.find({
          customerId: new ObjectId(customerId),
        });
      }

      responseReturn(res, 200, { orders });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_order = async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await customerOrderModel.findById(orderId);

      responseReturn(res, 200, { order });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_admin_orders = async (req, res) => {
    let { perPage, page, searchValue } = req.query;

    page = parseInt(page);
    perPage = parseInt(perPage);

    const skipPage = perPage * (page - 1);

    try {
      if (searchValue) {
      } else {
        const orders = await customerOrderModel
          .aggregate([
            {
              $lookup: {
                from: "authorders",
                localField: "_id",
                foreignField: "orderId",
                as: "suborder",
              },
            },
          ])
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });

        const totalOrder = await customerOrderModel.aggregate([
          {
            $lookup: {
              from: "authorders",
              localField: "_id",
              foreignField: "orderId",
              as: "suborder",
            },
          },
        ]);

        responseReturn(res, 200, { orders, totalOrder: totalOrder.length });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_admin_order = async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await customerOrderModel.aggregate([
        {
          $match: { _id: new ObjectId(orderId) },
        },
        {
          $lookup: {
            from: "authorders",
            localField: "_id",
            foreignField: "orderId",
            as: "suborder",
          },
        },
      ]);

      responseReturn(res, 200, { order: order[0] });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  admin_order_status_update = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
      await customerOrderModel.findByIdAndUpdate(orderId, {
        delivery_status: status,
      });
      responseReturn(res, 200, {
        message: "Order status updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_seller_orders = async (req, res) => {
    let { perPage, page, searchValue } = req.query;
    const { sellerId } = req.params;

    page = parseInt(page);
    perPage = parseInt(perPage);

    const skipPage = perPage * (page - 1);

    try {
      if (searchValue) {
      } else {
        const orders = await authOrderModel
          .find({
            sellerId,
          })
          .skip(skipPage)
          .limit(perPage)
          .sort({ createdAt: -1 });

        const totalOrder = await authOrderModel
          .find({
            sellerId,
          })
          .countDocuments();

        responseReturn(res, 200, { orders, totalOrder });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_seller_order = async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await authOrderModel.findById(orderId);

      responseReturn(res, 200, { order });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  seller_order_status_update = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
      await authOrderModel.findByIdAndUpdate(orderId, {
        delivery_status: status,
      });
      responseReturn(res, 200, {
        message: "Order status updated successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  create_payment = async (req, res) => {
    const { price } = req.body;

    try {
      const payment = await stripe.paymentIntents.create({
        amount: price * 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      responseReturn(res, 200, { clientSecret: payment.client_secret });
    } catch (error) {
      console.log(error);
      responseReturn(res, 500, { error: error.message });
    }
  };

  order_confirm = async (req, res) => {
    const { orderId } = req.params;

    try {
      await customerOrderModel.findByIdAndUpdate(orderId, {
        payment_status: "paid",
        delivery_status: "pending",
      });

      await authOrderModel.updateMany(
        { orderId: new ObjectId(orderId) },
        {
          payment_status: "paid",
          delivery_status: "pending",
        }
      );

      const cusOrder = await customerOrderModel.findById(orderId);

      const authOrder = await authOrderModel.find({
        orderId: new ObjectId(orderId),
      });

      const time = moment(Date.now()).format("l");

      const splitTime = time.split("/");

      await myShopWalletModel.create({
        amount: cusOrder.price,
        month: splitTime[0],
        year: splitTime[2],
      });

      // Split amount to different sellers
      for (let i = 0; i < authOrder.length; i++) {
        await sellerWalletModel.create({
          sellerId: authOrder[i].sellerId.toString(),
          amount: authOrder[i].price,
          month: splitTime[0],
          year: splitTime[2],
        });
      }

      responseReturn(res, 200, { message: "Success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new OrderController();
