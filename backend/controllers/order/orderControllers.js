const moment = require("moment");
const {
  mongo: { ObjectId },
} = require("mongoose");
const { responseReturn } = require("../../utils/response");
const customerOrderModel = require("../../models/customerOrderModel");
const authOrderModel = require("../../models/authOrderModel");
const cartModel = require("../../models/cartModel");

class OrderController {
  paymentCheck = async (id) => {
    try {
      const order = await customerOrderModel.findById(id);
      if (order.payment_status === "Unpaid") {
        await customerOrderModel.findByIdAndUpdate(id, {
          delivery_status: "Cancelled",
        });
        await authOrderModel.updateMany(
          {
            orderId: id,
          },
          {
            delivery_status: "Cancelled",
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
        delivery_status: "Pending",
        payment_status: "Unpaid",
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
          payment_status: "Unpaid",
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
          delivery_status: "Pending",
        })
        .countDocuments();

      const cancelledOrder = await customerOrderModel
        .find({
          customerId: new ObjectId(userId),
          delivery_status: "Cancelled",
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
}

module.exports = new OrderController();
