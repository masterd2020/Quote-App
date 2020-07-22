const QuoteError = require('./../utils/quoteError');

const handleJWTError = err => new QuoteError("Invalid token please log in", 401);

const handleJWTExpiredError = err => new QuoteError("Your token has expired please login in again", 401);

const handleDuplicateFieldsDB = err => {
  const value = err.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new QuoteError(message, 400);
};

const handleValidationError = err => {
  const error = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data:  ${error.join('. ')}`;
  
  return new QuoteError(message, 400);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  
  return new QuoteError(message, 400);
};

const sendErrorDev = (err, res, req) => {
  if(req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err,
      stackTrace: err.stack
    });
  }
  
  res.status(err.statusCode).render('error', {
    msg: err.message
  });
};

const sendErrorProd = (err, res, req) => {
  if(req.originalUrl.startsWith('/api')) {
    if(err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      //Send a generic message
    } else {
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong'
      });
    }
  }
  
  if(err.isOperational) {
    return res.status(err.statusCode).render('error', { msg: err.message })
    //Send a generic message
  } else {
    return res.status(500).render('error', { msg: 'Something went very wrong' });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res, req);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err};
    error.message = err.message
    
    if(error.name === 'ValidationError') error = handleValidationError(error);
    
    if(error.name === 'CastError') error = handleCastErrorDB(error);
    
    if(error.code === 11000) error = handleDuplicateFieldsDB(error);
    
    if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
    
    if(error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
    
    sendErrorProd(error, res, req);
  };

  next();
};