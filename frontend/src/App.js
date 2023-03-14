import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import { loadUser } from "./actions/userActions";
import store from "./store";
import { useEffect } from "react";
import Profile from "./components/user/Profile";

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/products/:id" component={ProductDetails} exact />

          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/me" component={Profile} />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
