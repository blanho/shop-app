import React, { Fragment } from "react";

const Rating = ({ stars, reviews }) => {
  return (
    <Fragment>
      <div className="ratings mt-auto">
        <div className="rating-outer">
          <div
            className="rating-inner"
            style={{ width: `${(stars / 5) * 100}%` }}
          ></div>
        </div>
        <span id="no_of_reviews">({reviews} Reviews)</span>
      </div>
    </Fragment>
  );
};

export default Rating;
