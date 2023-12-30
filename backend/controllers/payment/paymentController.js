const stripeModel = require("../../models/stripeModel");
const stripe = require("stripe")(
  "sk_test_51Hh8OeLrYCuAiRYOQ7FlaLnogUkAXHQJnp6eUAO6Tbq5TKPYbaC0qCYpug7NDgH4FkoBIlKzO92sF0L4Jg6FvQjp00uZVjq34o"
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
}

module.exports = new PaymentController();
