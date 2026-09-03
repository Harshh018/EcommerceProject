import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Typography from "@material-ui/core/Typography";
import { Slider } from "@material-ui/core";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { useParams } from "react-router-dom";

const categories = [
  "laptop",
  "footware",
  "bottom",
  "tops",
  "attire",
  "camera",
  "smartPhones",
];

const Products = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const params = useParams();

  // If URL has a param, check if it matches a category list item
  const routeParam = params.keyword || match?.params?.keyword || "";
  const isCategoryParam = categories.includes(routeParam.toLowerCase());

  const keyword = isCategoryParam ? "" : routeParam;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 250000]); // Increased max price to 250,000
  const [category, setCategory] = useState(isCategoryParam ? routeParam : "");
  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    // Keep category state updated if user navigates via URL directly
    if (isCategoryParam) {
      setCategory(routeParam);
    }
  }, [routeParam, isCategoryParam]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

  const count = Number(filteredProductsCount || productsCount || 0);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Products -- Ecommerce" />

          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="noProductsFound">No Products Found</p>
            )}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={250000}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((cat) => (
                <li
                  className={`category-link ${category === cat ? "activeCategory" : ""}`}
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setCurrentPage(1);
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {count > (resultPerPage || 8) && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage || 8}
                totalItemsCount={count}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;