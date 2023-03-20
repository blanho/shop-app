import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productsReducer,
  productDetailsReducer,
  newReviewReducer,
  newProductAdminReducer,
  deleteAdminProduct,
  updateAdminProductReducer,
} from "./reducers/productReducers";
import {
  allUsersReducer,
  authReducer,
  forgotPasswordReducer,
  getUserDetails,
  updateUserReducer,
  userReducer,
} from "./reducers/userReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  allOrdersReducer,
  myOrdersReducer,
  newOrderReducer,
  orderDetailReducer,
  orderReducer,
} from "./reducers/orderReducers";

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  auth: authReducer,
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailReducer,
  newReview: newReviewReducer,
  newAdminProduct: newProductAdminReducer,
  deleteAdminProduct: deleteAdminProduct,
  updateAdminProduct: updateAdminProductReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  allUsers: allUsersReducer,
  updateUser: updateUserReducer,
  userDetails: getUserDetails,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
