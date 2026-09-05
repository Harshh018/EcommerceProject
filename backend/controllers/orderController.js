const Order=require("../models/orderModel");
const Product=require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors=require("../middleware/catchAsyncError");

// create new order

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Safeguard: read whichever key was sent from client
  const activePinCode = shippingInfo?.pinCode || shippingInfo?.pincode;

  const order = await Order.create({
    shippingInfo: {
      address: shippingInfo.address,
      city: shippingInfo.city,
      state: shippingInfo.state,
      country: shippingInfo.country,
      pinCode: Number(activePinCode), // Guarantees pinCode is populated matching Schema
      phoneNo: Number(shippingInfo.phoneNo),
    },
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get singe order
exports.getSingleOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHandler("order not found with this id",404));

    }

    res.status(200).json({
        success:true,
        order,
    })
})


// get loggedinn user orders
exports.myOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find({user: req.user._id})

    res.status(200).json({
        success:true,
        orders,
    })
})

// get all orders--admin
exports.getAllOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find();

    let totalAmount=0;

    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    })
})


// update order status
// update order status
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    // FIX: Use findById instead of find so it returns a single document object
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (item) => {
            await updateStock(item.product, item.quantity);
        });
    }

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.Stock-=quantity;

      await product.save({validateBeforeSave:false})



}


// delete order
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    // Make sure the logged-in user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
        return next(
            new ErrorHandler("You are not authorized to delete this order", 403)
        );
    }

    // Don't allow deletion after delivery
    if (order.orderStatus === "Delivered") {
        return next(
            new ErrorHandler("Delivered orders cannot be deleted", 400)
        );
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});
