const { responseReturn } = require("../../utils/response");
const sellerModel = require("../../models/sellerModel");
const customerModel = require("../../models/customerModel");
const sellerCustomerModel = require("../../models/chat/sellerCustomerModel");
const sellerCustomerMessageModel = require("../../models/chat/sellerCustomerMessageModel");

class ChatController {
  add_customer_friend = async (req, res) => {
    const { sellerId, userId } = req.body;

    try {
      if (sellerId !== "") {
        const seller = await sellerModel.findById(sellerId);
        const user = await customerModel.findById(userId);
        const checkSeller = await sellerCustomerModel.findOne({
          $and: [
            {
              myId: {
                $eq: userId,
              },
            },
            {
              myFriends: {
                $elemMatch: {
                  fdId: sellerId,
                },
              },
            },
          ],
        });

        // If not friend then make it friend or add in the friend list
        if (!checkSeller) {
          await sellerCustomerModel.updateOne(
            {
              myId: userId,
            },
            {
              $push: {
                myFriends: {
                  fdId: sellerId,
                  name: seller.shopInfo?.shopName,
                  image: seller.image,
                },
              },
            }
          );
        }

        const checkCustomer = await sellerCustomerModel.findOne({
          $and: [
            {
              myId: {
                $eq: sellerId,
              },
            },
            {
              myFriends: {
                $elemMatch: {
                  fdId: userId,
                },
              },
            },
          ],
        });

        // If not friend then make it friend or add in the friend list
        if (!checkCustomer) {
          await sellerCustomerModel.updateOne(
            {
              myId: sellerId,
            },
            {
              $push: {
                myFriends: {
                  fdId: userId,
                  name: user.name,
                  image: "",
                },
              },
            }
          );
        }

        const messages = await sellerCustomerMessageModel.find({
          $or: [
            {
              $and: [
                {
                  receiverId: {
                    $eq: sellerId,
                  },
                },
                {
                  senderId: {
                    $eq: userId,
                  },
                },
              ],
            },
            {
              $and: [
                {
                  receiverId: {
                    $eq: userId,
                  },
                },
                {
                  senderId: {
                    $eq: sellerId,
                  },
                },
              ],
            },
          ],
        });

        const MyFriends = await sellerCustomerModel.findOne({ myId: userId });

        const currentFd = MyFriends.myFriends.find((s) => s.fdId === sellerId);

        responseReturn(res, 200, {
          myFriends: MyFriends.myFriends,
          currentFd,
          messages,
        });
      } else {
        const MyFriends = await sellerCustomerModel.findOne({ myId: userId });
        responseReturn(res, 200, { myFriends: MyFriends.myFriends });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  customer_message_send = async (req, res) => {
    const { userId, text, sellerId, name } = req.body;

    try {
      const message = await sellerCustomerMessageModel.create({
        senderId: userId,
        senderName: name,
        receiverId: sellerId,
        message: text,
      });

      const data = await sellerCustomerModel.findOne({ myId: userId });
      let myFriends = data.myFriends;
      let index = myFriends.findIndex((f) => f.fdId === sellerId);

      // put receiver name on top on the friend list after sending message
      while (index > 0) {
        let temp = myFriends[index];
        myFriends[index] = myFriends[index - 1];
        myFriends[index - 1] = temp;
        index--;
      }

      await sellerCustomerModel.updateOne(
        {
          myId: userId,
        },
        {
          myFriends,
        }
      );

      const data1 = await sellerCustomerModel.findOne({ myId: sellerId });

      let myFriends1 = data1.myFriends;
      let index1 = myFriends1.findIndex((f) => f.fdId === userId);

      while (index1 > 0) {
        let temp1 = myFriends1[index];
        myFriends1[index1] = myFriends1[index1 - 1];
        myFriends1[index1 - 1] = temp1;
        index1--;
      }

      await sellerCustomerModel.updateOne(
        {
          myId: sellerId,
        },
        {
          myFriends1,
        }
      );

      responseReturn(res, 201, { message });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new ChatController();
