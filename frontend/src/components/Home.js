import React, { Fragment, useEffect } from "react";

import MetaData from "./layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product";
import Loader from "./layout/Loader";
import { useAlert } from "react-alert";

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { products, loading, productsCount, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading && <Loader />}
      <MetaData title={"Home"} />
      <h1 id="products_heading">Latest Products</h1>
      <section id="products" className="container mt-5">
        <div className="row">
          {products &&
            products.map((product) => {
              return <Product key={product._id} product={product} />;
            })}
        </div>
      </section>
    </Fragment>
  );
};

export default Home;
