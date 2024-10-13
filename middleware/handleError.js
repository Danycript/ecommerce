const handleError = (error,req,res,next)=>{
   const statusCode = error.statusCode || 500
   const message = error.message || 'internal server error'

   res.status(statusCode).json({
     message: message,
     error: statusCode === 500 ? "Internal Server Error" : "Bad Request",
     statusCode: statusCode,
   });
}

export default handleError