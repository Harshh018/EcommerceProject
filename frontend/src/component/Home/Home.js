

import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "./ProductCard";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  // 1. Fetch products once on mount
  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  // 2. Handle errors separately so it doesn't trigger infinite getProduct calls
  useEffect(() => {
    if (error) {
      alert(error); // replace with alert.error(error) if using react-alert
      dispatch(clearErrors());
    }
  }, [error,dispatch]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;