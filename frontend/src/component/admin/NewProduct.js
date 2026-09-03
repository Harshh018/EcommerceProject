import React, { Fragment, useEffect, useState } from "react";
import "./NewProduct.css";

import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/productAction";
import { useAlert } from "react-alert";

import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";

import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

import SideBar from "./Sidebar";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";

const NewProduct = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, success } = useSelector(
    (state) => state.newProduct
  );

  // Product states
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);

  // Image states
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

  // Handle success and errors
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");

      history.push("/admin/dashboard");

      dispatch({
        type: NEW_PRODUCT_RESET,
      });
    }
  }, [dispatch, alert, error, history, success]);

  // Create product
  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    const productData = {
      name,
      price,
      description,
      category,
      stock,
      images,
    };

    dispatch(createProduct(productData));
  };

  // Handle image selection
  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);

          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Create Product" />

      <div className="dashboard">
        <SideBar />

        <div className="newProductContainer">
          <form
            className="createProductForm"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>

            {/* Product Name */}
            <div>
              <SpellcheckIcon />

              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Price */}
            <div>
              <AttachMoneyIcon />

              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <DescriptionIcon />

              <textarea
                placeholder="Product Description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            {/* Category */}
            <div>
              <AccountTreeIcon />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Choose Category</option>

                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div>
              <StorageIcon />

              <input
                type="number"
                placeholder="Stock"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            {/* Images */}
            <div id="createProductFormFile">
              <input
                type="file"
                name="images"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
                required
              />
            </div>

            {/* Image Preview */}
            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Product Preview"
                />
              ))}
            </div>

            {/* Create Button */}
            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;