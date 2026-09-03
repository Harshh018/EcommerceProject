
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

// Create Product -- ADMIN
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product,
    });
});


// GET ALL PRODUCTS
// GET ALL PRODUCTS
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 8;

    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(
        Product.find(),
        req.query
    )
        .search()
        .filter();

    // Get filtered products BEFORE pagination
    const filteredProducts = await apiFeature.query.clone();

    const filterProductsCount = filteredProducts.length;

    // Apply pagination
    apiFeature.pagination(resultPerPage);

    // Get paginated products
    const products = await apiFeature.query;

    console.log("===== PRODUCT PAGINATION =====");
    console.log("Query:", req.query);
    console.log("Total Products:", productCount);
    console.log("Filtered Products:", filterProductsCount);
    console.log("Current Page:", req.query.page);
    console.log("Products Returned:", products.length);
    console.log("==============================");

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount: filterProductsCount,
    });
});
// GET ALL PRODUCTS -- ADMIN
exports.getAdminProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});


// UPDATE PRODUCT -- ADMIN
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {

        // Delete old images from Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(
                product.images[i].public_id
            );
        }

        let imageLinks = [];

        // Upload new images
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imageLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imageLinks;
    }

    product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        product,
    });
});


// DELETE PRODUCT -- ADMIN
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Delete images from Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(
            product.images[i].public_id
        );
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});


// GET PRODUCT DETAILS
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});


// CREATE AND UPDATE PRODUCT REVIEW
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product.reviews.find(
        (rev) =>
            rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {

        product.reviews.forEach((rev) => {
            if (
                rev.user.toString() === req.user._id.toString()
            ) {
                rev.rating = Number(rating);
                rev.comment = comment;
            }
        });

    } else {

        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Calculate average rating
    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings =
        product.reviews.length === 0
            ? 0
            : avg / product.reviews.length;

    await product.save({
        validateBeforeSave: false,
    });

    res.status(200).json({
        success: true,
    });
});


// GET ALL REVIEWS
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});


// DELETE REVIEW
exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Remove the selected review
    const reviews = product.reviews.filter(
        (rev) =>
            rev._id.toString() !== req.query.id.toString()
    );

    // Calculate average rating
    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length > 0) {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    });
});
