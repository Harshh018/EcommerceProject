import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";

import { useSelector, useDispatch } from "react-redux";
import {
  getProductDetails,
  newReview,
  clearErrors,
} from "../../actions/productAction";

import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader.js";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData.js";
import { addItemsToCart } from "../../actions/cartAction.js";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";

import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants.js";

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Review
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Product rating
  const options = {
    size: "large",
    value: product?.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };

  // Get product details
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
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }

    dispatch(getProductDetails(match.params.id));
  }, [
    dispatch,
    match.params.id,
    error,
    reviewError,
    success,
    alert,
  ]);

 
  // INCREASE QUANTITY
 
  const increaseQuantity = () => {
    if (product?.stock <= quantity) {
      return;
    }

    setQuantity((prevQuantity) => prevQuantity + 1);
  };

 
  // DECREASE QUANTITY
 
  const decreaseQuantity = () => {
    if (quantity <= 1) {
      return;
    }

    setQuantity((prevQuantity) => prevQuantity - 1);
  };

 
  // ADD TO CART
 
  const addToCartHandler = () => {
    dispatch(addItemsToCart(match.params.id, quantity));
    alert.success("Item added to cart");
  };

 
  // REVIEW TOGGLE
 
  const submitReviewToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

 
  // SUBMIT REVIEW
 
  const reviewSubmitHandler = () => {
    if (rating === 0) {
      alert.error("Please select a rating");
      return;
    }

    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", match.params.id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData
            title={`${product?.name || "Product"} -- Ecommerce`}
          />

          <div className="ProductDetails">

            {/* ================= IMAGE SECTION ================= */}
          <div className="productImageSection">
    <div className="productImageCarousel">
        <Carousel>
            {product.images &&
                product.images.map((item, i) => (
                    <img
                        className="CarouselImage"
                        key={item.url || i}
                        src={item.url}
                        alt={`${i} Slide`}
                    />
                ))}
        </Carousel>
    </div>
</div>

            {/* ================= DETAILS SECTION ================= */}
            <div>

              {/* Product name */}
              <div className="detailsBlock-1">
                <h2>{product?.name}</h2>

                <p>
                  Product # {product?._id}
                </p>
              </div>

              {/* Rating */}
              <div className="detailsBlock-2">
                <Rating {...options} />

                <span>
                  ({product?.numOfReviews || 0} Reviews)
                </span>
              </div>

              {/* Price + Quantity */}
              <div className="detailsBlock-3">

                <h1>
                  ₹{product?.price}
                </h1>

                <div className="detailsBlock-3-1">

                  {/* ================= QUANTITY ================= */}
                  <div className="detailsBlock-3-1-1">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                    >
                      -
                    </button>

                    <input
                      type="number"
                      value={quantity}
                      readOnly
                    />

                    <button
                      type="button"
                      onClick={increaseQuantity}
                    >
                      +
                    </button>

                  </div>

                  {/* ================= ADD TO CART ================= */}
                  <button
                    type="button"
                    disabled={!product?.stock || product.stock < 1}
                    onClick={addToCartHandler}
                  >
                    ADD TO CART
                  </button>

                </div>

                {/* Stock */}
                <p>
                  Status:

                  <b
                    className={
                      product?.stock < 1
                        ? "redColor"
                        : "greenColor"
                    }
                  >
                    {product?.stock < 1
                      ? "OutOfStock"
                      : "InStock"}
                  </b>
                </p>

              </div>

              {/* Description */}
              <div className="detailsBlock-4">

                Description:

                <p>
                  {product?.description}
                </p>

              </div>

              {/* Review button */}
              <button
                onClick={submitReviewToggle}
                className="submitReview"
              >
                Submit Review
              </button>

            </div>
          </div>

          {/* ================= REVIEWS ================= */}

          <h3 className="reviewsHeading">
            Reviews
          </h3>

          {product?.reviews && product.reviews.length > 0 ? (

            <div className="reviews">

              {product.reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                />
              ))}

            </div>

          ) : (

            <p className="noReviews">
              No Reviews Yet
            </p>

          )}

          {/* ================= REVIEW DIALOG ================= */}

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >

            <DialogTitle>
              Submit Review
            </DialogTitle>

            <DialogContent className="submitDialog">

              <Rating
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
              />

            </DialogContent>

            <DialogActions>

              <Button
                onClick={submitReviewToggle}
                color="secondary"
              >
                Cancel
              </Button>

              <Button
                onClick={reviewSubmitHandler}
                color="primary"
              >
                Submit
              </Button>

            </DialogActions>

          </Dialog>

        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;