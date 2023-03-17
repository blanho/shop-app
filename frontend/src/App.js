import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import { loadUser } from "./actions/userActions";
import store from "./store";
import { useEffect, useState } from "react";
import Profile from "./components/user/Profile";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./components/cart/Payment";
import OrderSuccess from "./components/cart/OrderSuccess";

function App() {
  const [stripeAPIKeyClient, setStripeAPIKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeKey() {
      const { data } = await axios.get("/api/v1/stripeAPI");
      console.log(data);
      setStripeAPIKey(data.stripeAPIKey);
    }
    getStripeKey();
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} index />
        <Route path="/search/:keyword" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<NewPassword />} />
        <Route path="/cart" element={<Cart />} index />
        <Route
          path="/shipping"
          element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/confirm"
          element={
            <ProtectedRoute>
              <ConfirmOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              {stripeAPIKeyClient && (
                <Elements stripe={loadStripe(stripeAPIKeyClient)}>
                  <Payment />
                </Elements>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/me/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/update"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
