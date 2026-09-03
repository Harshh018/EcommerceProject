const ErrorHandler=require("../utils/errorhandler");

module.exports=(err,req,res,next)=>{

    err.statusCode=err.statusCode || 500;

    err.message=err.message || "internal server error";

    // WRONG MONGODB ID ERROR
    if(err.name === "CastError"){
        const message=`Resources not found,Invalid:${err.path}`;
        err = new ErrorHandler(message,400)
    }
  

    // mongose duplicate error
    if(err.code=== 11000){
        const message=`duplicate${Object.key(err.keyValue)} Entered`
        err=new ErrorHandler(message,400);
    }

// wrong jwt error
     if(err.name === "JsonWebTokenError"){
        const message=`Json web token is invalid try again`;
        err = new ErrorHandler(message,400)
    }

// expire error
      if(err.name === "TokenExpireError"){
        const message=`Json web token is expire try again`;
        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });

}