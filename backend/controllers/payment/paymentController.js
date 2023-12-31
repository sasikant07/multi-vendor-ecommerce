const stripeModel = require("../../models/stripeModel");
const sellerModel = require("../../models/sellerModel");
const stripe = require("stripe")(
  "sk_test_51OTQNfCbH4s1f9nV6Ar9rB6RdS9FGNeWANBPI9FSkxjRyHVZ9gMjzGbCthrajPJ8bvRV6yA4R4UEls9V0NodYEQI00w0fBBd0Q"
);
const { v4: uuidv4 } = require("uuid");
const { responseReturn } = require("../../utils/response");

class PaymentController {
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
}

module.exports = new PaymentController();
