import React, { Fragment, useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import MetaData from "./layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product";
import Loader from "./layout/Loader";
import { useAlert } from "react-alert";

const Home = ({ match }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);

  const dispatch = useDispatch();
  const alert = useAlert();

  const { products, loading, productsCount, error, resPerPage } = useSelector(
    (state) => state.products
  );

  const keyword = match.params.keyword;
  console.log(keyword);

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts(keyword, currentPage, price));
  }, [dispatch, error, alert, currentPage, keyword, price]);

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <Fragment>
      {loading && <Loader />}
      <MetaData title={"Home"} />
      <h1 id="products_heading">Latest Products</h1>
      <section id="products" className="container mt-5">
        <div className="row">
          {keyword ? (
            <Fragment>
              <div className="col-6 col-md-3 mt-5 mb-5">
                <div className="px-5">
                  <Slider
                    range
                    className="t-slider"
                    min={1}
                    max={1000}
                    marks={{
                      1: `$1`,
                      1000: `$1000`,
                    }}
                    defaultValue={[1, 1000]}
                    value={price}
                    onChange={(price) => setPrice(price)}
                  />
                </div>
              </div>
              <div className="col-6 col-md-9">
                <div className="row">
                  {products &&
                    products.map((product) => {
                      return (
                        <Product key={product._id} product={product} col={4} />
                      );
                    })}
                </div>
              </div>
            </Fragment>
          ) : (
            products &&
            products.map((product) => {
              return <Product key={product._id} product={product} col={3} />;
            })
          )}
        </div>
      </section>
      {resPerPage <= productsCount && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resPerPage}
            totalItemsCount={productsCount}
            onChange={setCurrentPageNo}
            nextPageText={"Next"}
            prevPageText={"Prev"}
            firstPageText={"First"}
            lastPageText={"Last"}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      )}
    </Fragment>
  );
};

export default Home;
