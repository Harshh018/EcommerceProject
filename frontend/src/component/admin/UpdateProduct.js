import React, { Fragment, useEffect, useState } from "react";
import "./NewProduct.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SideBar from "./Sidebar";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";

const UpdateProduct = ({ history, match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  // Product details
  const { error, product } = useSelector(
    (state) => state.productDetails
  );

  // Update product state
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);

  // New images selected from computer
  const [images, setImages] = useState([]);

  // Preview of new images
  const [imagesPreview, setImagesPreview] = useState([]);

  // Existing Cloudinary images
  const [oldImages, setOldImages] = useState([]);

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

  const productId = match.params.id;

  // Get product details
  useEffect(() => {
    if (!product || product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || 0);
      setCategory(product.category || "");
      setStock(product.stock || 0);

      // Show existing images
      setOldImages(product.images || []);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Product Updated Successfully");

      history.push("/admin/products");

      dispatch({
        type: UPDATE_PRODUCT_RESET,
      });
    }
  }, [
    dispatch,
    product,
    productId,
    error,
    updateError,
    isUpdated,
    alert,
    history,
  ]);

  // Submit updated product
  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

    // Add selected images
    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(updateProduct(productId, myForm));
  };

  // Select new images
  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Clear only NEW image selections
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [
            ...old,
            reader.result,
          ]);

          setImages((old) => [
            ...old,
            reader.result,
          ]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Update Product" />

      <div className="dashboard">
        <SideBar />

        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateProductSubmitHandler}
          >
            <h1>Update Product</h1>

            {/* PRODUCT NAME */}
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

            {/* PRICE */}
            <div>
              <AttachMoneyIcon />

              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <DescriptionIcon />

              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                cols="30"
                rows="3"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <AccountTreeIcon />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option value="">
                  Choose Category
                </option>

                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            {/* STOCK */}
            <div>
              <StorageIcon />

              <input
                type="number"
                placeholder="Stock"
                required
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value)
                }
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div id="createProductFormFile">
              <input
                type="file"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>

            {/* OLD IMAGES */}
            {oldImages.length > 0 && (
              <>
                <h3>Current Images</h3>

                <div id="createProductFormImage">
                  {oldImages.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt="Current Product"
                    />
                  ))}
                </div>
              </>
            )}

            {/* NEW IMAGE PREVIEWS */}
            {imagesPreview.length > 0 && (
              <>
                <h3>New Images</h3>

                <div id="createProductFormImage">
                  {imagesPreview.map(
                    (image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt="New Product Preview"
                      />
                    )
                  )}
                </div>
              </>
            )}

            {/* UPDATE BUTTON */}
            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;