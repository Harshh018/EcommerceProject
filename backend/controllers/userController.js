const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");
const crypto = require("crypto");

// ================= REGISTER USER =================

exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password, avatar } = req.body;

    // Check required fields
    if (!name || !email || !password) {
        return next(
            new ErrorHandler("Please enter name, email and password", 400)
        );
    }

    let myCloud;

    // Upload avatar only if provided
    if (avatar) {
        myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: avatar
            ? {
                  public_id: myCloud.public_id,
                  url: myCloud.secure_url,
              }
            : {
                  public_id: "default_avatar",
                  url: "/profile.png",
              },
    });

    sendToken(user, 201, res);
});


// ================= LOGIN USER =================

exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new ErrorHandler("Please enter email and password", 400)
        );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(
            new ErrorHandler("Invalid email or password", 401)
        );
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(
            new ErrorHandler("Invalid email or password", 401)
        );
    }

    sendToken(user, 200, res);
});


// ================= LOGOUT USER =================

exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out",
    });
});


// Logout User
export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("shippingInfo");
    localStorage.removeItem("cartItems");
    sessionStorage.removeItem("orderInfo");

    await axios.get(`/api/v1/logout`);

    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message });
  }
};

// ================= FORGOT PASSWORD =================

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        return next(
            new ErrorHandler("User not found", 404)
        );
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({
        validateBeforeSave: false,
    });

    const resetPasswordUrl =
        `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message =
        `Your password reset token is :- \n\n${resetPasswordUrl}\n\n` +
        `If you have not requested this email, please ignore it.`;

    try {

        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({
            validateBeforeSave: false,
        });

        return next(
            new ErrorHandler(error.message, 500)
        );
    }
});


// ================= RESET PASSWORD =================

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Reset password token is invalid or has expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(
            new ErrorHandler("Password does not match", 400)
        );
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});


// ================= GET USER DETAILS =================

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});


// ================= UPDATE PASSWORD =================

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id)
        .select("+password");

    const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
    );

    if (!isPasswordMatched) {
        return next(
            new ErrorHandler("Old password is not correct", 400)
        );
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
            new ErrorHandler("Password does not match", 400)
        );
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});


// ================= UPDATE USER PROFILE =================

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    // If new avatar is provided
    if (req.body.avatar && req.body.avatar !== "") {

        const user = await User.findById(req.user.id);

        // Delete old image from Cloudinary
        if (user.avatar && user.avatar.public_id) {
            await cloudinary.v2.uploader.destroy(
                user.avatar.public_id
            );
        }

        // Upload new image
        const myCloud = await cloudinary.v2.uploader.upload(
            req.body.avatar,
            {
                folder: "avatars",
                width: 150,
                crop: "scale",
            }
        );

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        newUserData,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        user,
    });
});


// ================= GET ALL USERS =================

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});


// ================= GET SINGLE USER =================

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(
                `User does not exist: ${req.params.id}`,
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});


// ================= UPDATE USER ROLE =================

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(
        req.params.id,
        newUserData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!user) {
        return next(
            new ErrorHandler(
                `User does not exist with this Id: ${req.params.id}`,
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});


// ================= DELETE USER =================

exports.deleteUSer = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(
                `User does not exist with id: ${req.params.id}`,
                404
            )
        );
    }

    // Delete avatar from Cloudinary
    if (user.avatar && user.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(
            user.avatar.public_id
        );
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});