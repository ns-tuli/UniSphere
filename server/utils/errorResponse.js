class ErrorResponse extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
  
      // Capturing stack trace for debugging purposes
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default ErrorResponse;
  