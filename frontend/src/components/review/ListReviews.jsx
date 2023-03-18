import React, { Fragment } from "react";

const ListReviews = ({ reviews }) => {
  return (
    <Fragment>
      <div className="App">
        <div class="container container-fluid">
          <div class="reviews w-75">
            <h3>Other's Reviews:</h3>
            <hr />
            {reviews &&
              reviews.map((review) => {
                return (
                  <div key={review._id} class="review-card my-3">
                    <div class="rating-outer">
                      <div
                        class="rating-inner"
                        style={{ width: `${(review.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p class="review_user">by {review.name}</p>
                    <p class="review_comment">{review.comment}</p>

                    <hr />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ListReviews;
