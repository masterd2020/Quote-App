const crypto = require('crypto');
const multer = require('multer');
const { promisify } = require('util');
const jwt = require ('jsonwebtoken');
const User = require('./../models/userModel');
const asyncError = require('./asyncError');
const QuoteError = require('./../utils/quoteError');
const sendEmail = require('./../utils/email');


// Multer Configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/img/users/`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new QuoteError('Invalid file type please upload only an image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

const signToken = id => {
  return jwt.sign({ id } , process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  if(process.env.NODE_ENV === "production") cookieOptions.secure = true;
  
  res.cookie("jwt", token, cookieOptions)
  this.password = undefined;
    
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    })
}

exports.signup = asyncError(async (req, res, next) => {
  
  if(req.file) {
    req.body.photo = req.file.filename;
  }
    const user = await User.create(req.body);
    
    sendToken(user, 201, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    status: 'success'
  })
}

exports.login = asyncError(async (req, res, next) => {
  // 1) Check if the user provide an email or password in the req.body
  const { email, password } = req.body;
  
  if(!email || !password) {
    return next(new QuoteError("Please provide your email and password"))
  }
  
  // 2) Check if the user exist in the database
  const user = await User.findOne({email}).select('+password');
  const correctPass = await user.correctPassword(password, user.password);
  
  if(!user || !correctPass) {
    return next(new QuoteError("Incorrect Password or Email", 401))
  }
  
  sendToken(user, 200, res);
  
  /*const token = signToken(user._id);
  
  // 3) Login the user
  res.status(200).json({
    status: 'sucess',
    token
  })*/
});

exports.isLoggedIn = asyncError(async (req, res, next) => {
 try {
   
    if(req.cookies.jwt) {
      
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
     
      // 1) check if the user exist in the database
      const user = await User.findById(decoded.id);
      
      if(!user) {
        return next()
      }
      
      // 2) check if the user does not changed password before the token is issued
      if(user.passwordChangedAfter(decoded.iat)) {
        return next()
      }
      
      // if everything is ok GRANT ACCESS TO PROTECTED ROUTE
      req.user = user;
      res.locals.user = user;
    }
 } catch (e) {
    return next();
 }
    
  next();
});

exports.protect = asyncError(async (req, res, next) => {
  let token;
  // 1) Check if the is token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  
  if(!token) {
    return next(new QuoteError('You are not Logged in', 401))
  }
  
  // 2) Check if the user does not alter the payload
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
 
  // 3) check if the user exist in the database
  const user = await User.findById(decoded.id).populate('quote');
  
  if(!user) {
    return next(new QuoteError('The user belonging to this token does not exist', 401))
  }
  
  // 4) check if the user does not changed password before the token is issued
  if(user.passwordChangedAfter(decoded.iat)) {
    return next(new QuoteError('User currently changed password', 401))
  }
  
  // if everything is ok GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  res.locals.user = user;
  next();
});

exports.restrictTo = (...allowUser) => {
  return (req, res, next) => {
  
    if(!allowUser.includes(req.user.role)) {
      return next(new QuoteError('You are not allow to access this route', 403))
    }
    
    next();
  }
};

exports.forgotPassword = asyncError(async (req, res, next) => {
  
  // 1) Check if the posted email is in the database
  const user = await User.findOne({email: req.body.email });
  if(!user) {
    return next(new QuoteError('No user found with that email', 400))
  }
  
  // 2) Generate random string
  const resetToken = user.resetPassword();
  user.save({ validateBeforeSave: false })
  
  // 3) Send the reset token via email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
   
   const message = `Forgot your password suit a PATCH request with your password and confirm password to: ${resetURL}\nIf you did not forgot your password Please ignore`;
   
   await sendEmail({
     email: req.body.email,
     subject: 'Your password Reset Token (Valid for10min)',
     message
   })
   
   res.status(200).json({
     status: 'success',
     message: 'Email sent'
   })
  } catch(err) {
    passwordResetToken = undefined;
    passwordResetTokenExpire = undefined;
    await user.save({validateBeforeSave: false})
    console.log(err);
    return next(new QuoteError('Email was not send', 500));
  }
  
});

exports.resetPassword = asyncError(async(req, res, next) => {
  // 1) Check if the user exist in the database
  const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetTokenExpire: { $gt: Date.now() } }).select('+password');
  
  if(!user) {
    return next(new QuoteError('Password reset token has expired', 401))
  }
  
  // 2) Update Password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save();
  
  // 3) changed the passwordChangedAt
  
  // 4) Log the user in
  sendToken(user, 200, res);
});

exports.updateMyPassword = asyncError(async (req, res, next) => {
  // 1) Get the user id from the currently logged in user
  const user = await User.findById(req.user._id).select('+password');
  console.log(user);
 
  if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new QuoteError('Your current password is incorrect', 401));
  }
  
  // 2) Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  
  // 3) Log the user in
  sendToken(user, 200, res);
});