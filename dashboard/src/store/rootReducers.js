import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";
import chatReducer from "./Reducers/chatReducer";
import orderReducer from "./Reducers/orderReducer";
import paymentReducer from "./Reducers/paymentReducer";
import productReducer from "./Reducers/productReducer";
import sellerReducer from "./Reducers/sellerReducer";

const rootReducers = {
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  seller: sellerReducer,
  chat: chatReducer,
  order: orderReducer,
  payment: paymentReducer,
};

export default rootReducers;
