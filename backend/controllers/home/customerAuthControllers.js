const bcrypt = require("bcrypt");
const { responseReturn } = require("../../utils/response");
const customerModel = require("../../models/customerModel");
const sellerCustomerModel = require("../../models/chat/sellerCustomerModel");
const { createToken } = require("../../utils/tokenCreate");

class CustomerAuthController {
  customer_register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const customer = await customerModel.findOne({ email });

      if (customer) {
        responseReturn(res, 404, { error: "Email already exists" });
      } else {
        const createCustomer = await customerModel.create({
          name: name.trim(),
          email: email.trim(),
          password: await bcrypt.hash(password, 10),
          method: "manually",
        });

        // For chat purpose
        await sellerCustomerModel.create({
          myId: createCustomer.id,
        });

        const token = await createToken({
          id: createCustomer.id,
          name: createCustomer.name,
          email: createCustomer.email,
          method: createCustomer.method,
        });

        res.cookie("customerToken", token, {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        });
        responseReturn(res, 201, {
          message: "User registartion success",
          token,
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  customer_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const customer = await customerModel
        .findOne({ email })
        .select("+password");

      if (customer) {
        const match = await bcrypt.compare(password, customer.password);

        if (match) {
          const token = await createToken({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            method: customer.method,
          });
          res.cookie("customerToken", token, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, {
            message: "User login success",
            token,
          });
        } else {
          responseReturn(res, 404, { error: "Password wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new CustomerAuthController();
