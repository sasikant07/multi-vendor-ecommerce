const stripeModel = require("../../models/stripeModel");
const sellerModel = require("../../models/sellerModel");
const sellerWalletModel = require("../../models/sellerWalletModel");
const myShopWalletModel = require("../../models/myShopWalletModel");
const withdrawRequestModel = require("../../models/withdrawRequestModel");
const stripe = require("stripe")(
  "sk_test_51OTQNfCbH4s1f9nV6Ar9rB6RdS9FGNeWANBPI9FSkxjRyHVZ9gMjzGbCthrajPJ8bvRV6yA4R4UEls9V0NodYEQI00w0fBBd0Q"
);
const { v4: uuidv4 } = require("uuid");
const { responseReturn } = require("../../utils/response");

class PaymentController {
  sumAmount = (data) => {
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      sum = sum + data[i].amount;
    }

    return sum;
  };

  create_stripe_connect_account = async (req, res) => {
    const { id } = req;
    const uuid = uuidv4();

    try {
      const stripeInfo = await stripeModel.findOne({ sellerId: id });

      if (stripeInfo) {
        await stripeModel.deleteOne({ sellerId: id });
        const account = await stripe.accounts.create({ type: "express" });
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: "http://localhost:3030/refresh",
          return_url: `http://localhost:3030/success?activeCode=${uuid}`,
          type: "account_onboarding",
        });
        await stripeModel.create({
          sellerId: id,
          stripeId: account.id,
          code: uuid,
        });

        responseReturn(res, 201, { url: accountLink.url });
      } else {
        const account = await stripe.accounts.create({ type: "express" });
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: "http://localhost:3030/refresh",
          return_url: `http://localhost:3030/success?activeCode=${uuid}`,
          type: "account_onboarding",
        });
        await stripeModel.create({
          sellerId: id,
          stripeId: account.id,
          code: uuid,
        });

        responseReturn(res, 201, { url: accountLink.url });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  active_stripe_connect_account = async (req, res) => {
    const { activeCode } = req.params;
    const { id } = req;

    try {
      const userStripeInfo = await stripeModel.findOne({
        code: activeCode,
      });

      if (userStripeInfo) {
        await sellerModel.findByIdAndUpdate(id, {
          payment: "active",
        });
        responseReturn(res, 200, { message: "Payment activated successfully" });
      } else {
        responseReturn(res, 400, { message: "Payment activation failed" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_admin_payment_details = async (req, res) => {
    const { sellerId } = req.params;

    try {
      const payments = await sellerWalletModel.find({ sellerId });

      const pendingWithdraws = await withdrawRequestModel.find({
        $and: [
          {
            sellerId: {
              $eq: sellerId,
            },
          },
          {
            status: {
              $eq: "pending",
            },
          },
        ],
      });

      const successWithdraws = await withdrawRequestModel.find({
        $and: [
          {
            sellerId: {
              $eq: sellerId,
            },
          },
          {
            status: {
              $eq: "success",
            },
          },
        ],
      });

      const pendingAmount = this.sumAmount(pendingWithdraws);
      const withdrawnAmount = this.sumAmount(successWithdraws);
      const totalAmount = this.sumAmount(payments);

      let availableAmount = 0;

      if (totalAmount > 0) {
        availableAmount = totalAmount - (pendingAmount - withdrawnAmount);
      }

      responseReturn(res, 200, {
        totalAmount,
        pendingAmount,
        withdrawnAmount,
        availableAmount,
        successWithdraws,
        pendingWithdraws,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  send_withdrawl_request = async (req, res) => {
    const { amount, sellerId } = req.body;

    try {
      const withdrawl = await withdrawRequestModel.create({
        sellerId,
        amount: parseInt(amount),
      });

      responseReturn(res, 200, { withdrawl, message: "Withdrawl amount request sent" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new PaymentController();
