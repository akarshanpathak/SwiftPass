const errorMiddleware=(err,req,res,next)=>{

    let statusCode=500;
    let message= "Internal server error"

    if(typeof err ==="object"){
        statusCode=err.statusCode || 500;
        message=err.message || "Internal server Error"

        if (err.name === "CastError") {
            message = `Resource not found. Invalid: ${err.path}`;
            statusCode = 400;
        }
    }
    else if(typeof err ==="string"){
        message=err;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === "development" && typeof err === "object" ? err.stack : null,
    });
}

export default errorMiddleware;
