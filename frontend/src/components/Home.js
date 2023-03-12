import React, { Fragment, useEffect } from "react";

import MetaData from "./layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product";

const Home = () => {
  const dispatch = useDispatch();

  const { products, loading, productsCount, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Fragment>
      {loading && <h1>Loading...</h1>}
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
