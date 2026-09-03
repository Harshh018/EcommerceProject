const mongoose=require("mongoose");
const validator= require("validator");
const bcrypt= require("bcryptjs");
const jwt=require("jsonwebtoken")
const crypto=require("crypto");

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"name cannot exceed 30 character"],
        minLength:[4,"name should be more than 4 character"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter avalid email"]
    },
    password:{
        type:String,
        required:[true,"pplease enter your password"],
        minLength:[5,"password should be greater than 5 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },role:{
        type:String,
        default:"user",

    },

    createdAt:{
        type:Date,
        default:Date.now(),
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,

    
});

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        // return next();
    }

    this.password= await bcrypt.hash(this.password,10);
    // next();
})

// JET token
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

// compare password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}


// generating password reset token
userSchema.methods.getResetPasswordToken=function()
{

    // generating token
    const resetToken=crypto.randomBytes(20).toString("hex");


// hashimg and adding reset password
this.resetPasswordToken=crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");

this.resetPasswordExpire=Date.now()+ 15*60*1000;

return resetToken;
}
module.exports=mongoose.model("User",userSchema);


