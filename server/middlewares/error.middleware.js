const errorMiddleware=(err,req,res,next)=>{

    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal server error"

    if (err.name === "CastError") {
        err.message = `Resource not found. Invalid: ${err.path}`;
        err.statusCode = 400;
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    })
}

export default errorMiddleware;
