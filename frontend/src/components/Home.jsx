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
import { useParams } from "react-router-dom";

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();
  const alert = useAlert();

  const {
    products,
    loading,
    productsCount,
    error,
    resPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const { keyword } = useParams();
  const categories = [
    "Electronics",
    "Cameras",
    "Laptops",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Clothes/Shoes",
    "Beauty/Health",
    "Sports",
    "Outdoor",
    "Home",
  ];

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts(keyword, currentPage, price, category, rating));
  }, [dispatch, error, alert, currentPage, keyword, price, category, rating]);

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  let count = productsCount;
  if (keyword) {
    count = filteredProductsCount;
  }
  return (
    <Fragment>
      <MetaData title={"Home"} />
      {!loading ? (
        <Fragment>
          <section id="products" className="container mt-5">
            <div className="row">
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
                    <hr className="my-5" />
                    <div className="mt-5">
                      <h4 className="mb-3">Categories</h4>
                      <ul className="pl-0">
                        {categories.map((category) => {
                          return (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={category}
                              onClick={() => setCategory(category)}
                            >
                              {category}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <hr className="my-3" />
                    <div className="mt-5">
                      <h4 className="mb-3">Ratings</h4>
                      <ul className="pl-0">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          return (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={rating}
                              onClick={() => setRating(rating)}
                            >
                              <div className="rating-outer">
                                <div
                                  className="rating-inner"
                                  style={{ width: `${rating * 20}%` }}
                                >
                                  {rating}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-9">
                  <div className="row">
                    {products &&
                      products.map((product) => {
                        return (
                          <Product
                            key={product._id}
                            product={product}
                            col={4}
                          />
                        );
                      })}
                  </div>
                </div>
              </Fragment>
            </div>
          </section>
          {resPerPage <= count && (
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
      ) : (
        <Loader />
      )}
    </Fragment>
  );
};

export default Home;
