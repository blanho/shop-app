import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";

import Sidebar from "./Sidebar";
import { allUsers, clearErrors } from "../../actions/userActions";

import {
  deleteProuctReview,
  getProductReviews,
} from "../../actions/productActions";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";

const ProductReview = () => {
  const [productId, setProductId] = useState("");

  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, reviews } = useSelector(
    (state) => state.productReviews
  );

  const { isDeleted } = useSelector((state) => state.deleteReview);

  useEffect(() => {
    dispatch(allUsers());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Review deleted successfully");
      dispatch({ type: DELETE_REVIEW_RESET });
    }

    if (productId !== "") {
      dispatch(getProductReviews(productId));
    }
  }, [dispatch, alert, error, navigate, productId, isDeleted]);

  const deleteHandler = (id) => {
    dispatch(deleteProuctReview(id, productId));
  };

  const setReviews = () => {
    const data = {
      columns: [
        {
          label: "Review ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "user",
          field: "user",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };
    reviews.forEach((review) => {
      data.rows.push({
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        user: review.name,
        actions: (
          <button
            className="btn btn-danger py-1 px-2 ml-2"
            onClick={() => deleteHandler(review._id)}
          >
            <i className="fa fa-trash"></i>
          </button>
        ),
      });
    });
    return data;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getProductReviews(productId));
  };
  return (
    <Fragment>
      <MetaData title={"Product Reviews"} />
      <div className="row">
        <Sidebar />
        <div className="col-12 col-md-10">
          <div className="row justify-content-center mt-5">
            <div className="col-5">
              <form onSubmit={submitHandler}>
                <div className="form-group">
                  <label htmlFor="productId_field">Enter Product ID</label>
                  <input
                    type="text"
                    id="productId_field"
                    className="form-control"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </div>

                <button
                  id="search_button"
                  type="submit"
                  className="btn btn-primary btn-block py-2"
                >
                  SEARCH
                </button>
              </form>
            </div>
          </div>
          {reviews && reviews.length > 0 && (
            <Fragment>
              <h1 className="my-5">All Reviews</h1>
              {loading ? (
                <Loader />
              ) : (
                <Fragment>
                  <MDBDataTable
                    data={setReviews()}
                    className="px-3"
                    bordered
                    striped
                    hover
                  />
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReview;
