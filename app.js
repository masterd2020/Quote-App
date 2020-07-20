const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require ("express-rate-limit");
const helmet = require ("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require('cookie-parser');
//const hpp = require ("hpp");


const userRoute = require('./routes/userRoute');
const quoteRoute = require('./routes/quoteRoute');
const viewRoute = require('./routes/viewRoute');
const QuoteError = require('./utils/quoteError');
const globalErrorHandling = require('./controllers/globalErrorHandling');

// Start express app
const app = express();

// Global Middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Http headers
app.use(helmet());

// Logging Middleware
if(process.env.NODE_ENV === "development") app.use(morgan('dev'));

// Rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP please try again in an hour"
});

app.use("/api", limiter);

// Parsing Incoming Data
app.use(express.json());
app.use(cookieParser());

// Nosql injection
app.use(mongoSanitize());

// xss 
app.use(xss());


// Mounting Routes
app.use('/', viewRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/quotes', quoteRoute);

app.all("*", (req, res, next) => {
  next(new QuoteError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling
app.use(globalErrorHandling);

module.exports = app;