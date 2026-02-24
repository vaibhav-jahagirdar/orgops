const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let errorCode = "INTERNAL_SERVER_ERROR";
  let message = "Something went wrong";
  let isOperational = false;

  if (err.isOperational) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    isOperational = true;
  } 
  
  else if (err.name === "ZodError") {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = err.errors.map(e => e.message).join(",");
    isOperational = true;
  } 
  
  else if (err.code === "23505") {
    statusCode = 409;
    errorCode = "UNIQUE_CONSTRAINT_VIOLATION";
    message = "Duplicate value violates unique constraint";
    isOperational = true;
  } 
  
  else if (err.code === "23503") {
    statusCode = 400;
    errorCode = "FOREIGN_KEY_VIOLATION";
    message = "Invalid reference to related resource";
    isOperational = true;
  }

  if (!isOperational) {
    console.error("UNEXPECTED ERROR:", err);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
      }),
    },
  });
};

module.exports = errorHandler;