import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productActions";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { addItemToCart } from "../../actions/cartActions";
import {
  NEW_REVIEW_RESET,
  REVIEW_REALTIME,
} from "../../constants/productConstants";
import ListReviews from "../review/ListReviews";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Container,
} from "react-bootstrap";
import Rating from "./Rating";
const ProductDetails = ({ socket }) => {
  const dispatch = useDispatch();
  let [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const alert = useAlert();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { user } = useSelector((state) => state.auth);
  const { error: reviewError, success } = useSelector(
    (state) => state.newReview
  );
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Review posted successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(productId));
  }, [dispatch, alert, error, productId, reviewError, success]);

  // Realtime
  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", productId);
    }
  }, [socket, productId]);

  useEffect(() => {
    if (socket) {
      socket.on("sendCommentToClient", (msg) => {
        dispatch({ type: REVIEW_REALTIME, payload: msg });
      });
    }
  }, [socket, productId, dispatch, product]);

  const addToCart = () => {
    dispatch(addItemToCart(productId, qty));
    alert.success("Item Added to Cart");
    navigate("/cart");
  };

  const reviewHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.set("rating", rating);
    formData.set("comment", comment);
    formData.set("productId", productId);

    socket.emit("createComment", {
      rating,
      comment,
      productId,
      user: user._id,
      name: user.name,
    });
  };

  const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    height: "600px",
  };

  return (
    <Fragment>
      <MetaData title={product.name} />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Row className="mt-5">
            <Col md={5}>
              <Slide>
                {product.images &&
                  product.images.map((image, index) => {
                    return (
                      <Image
                        key={image.url}
                        style={{
                          ...divStyle,
                          backgroundImage: `url(${image.url})`,
                        }}
                        src={image.url}
                        alt={image.url}
                        fluid
                      />
                    );
                  })}
              </Slide>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>{product.name}</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Rating
                      stars={product.ratings}
                      reviews={`${product.numofReviews}`}
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>Price: {product.price}</ListGroup.Item>
                  <ListGroup.Item>
                    Description: {product.description}
                  </ListGroup.Item>
                  <ListGroup.Item>Sold By: {product.seller}</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.stock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.stock).keys()].map((x) => {
                              return (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              );
                            })}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCart}
                      className="btn-block"
                      type="button"
                      disabled={product.stock === 0}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col md={12}>
              <ListGroup variant="flush">
                {product.reviews.length === 0 ? (
                  <h3 style={{ textAlign: "center" }}>No Reviews</h3>
                ) : (
                  <h3 style={{ textAlign: "center" }}>Reviews</h3>
                )}
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong className="mr-1">{review.name}</strong>
                    <div className="rating-outer">
                      <div
                        className="rating-inner"
                        style={{ width: `${(review.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  {user ? (
                    <Form onSubmit={reviewHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                        <Button
                          className="mt-2"
                          type="submit"
                          variant="primary"
                        >
                          Submit
                        </Button>
                      </Form.Group>
                    </Form>
                  ) : (
                    <div className="alert alert-danger mt-5" type="alert">
                      Login to post your review
                    </div>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
