const User = require('./../models/userModel');
const asyncError = require('./asyncError');
const QuoteError = require('./../utils/quoteError');

const filterBody = (obj, ...filteredFields) => {
  let object = {};
  Object.keys(obj).forEach(el => {
    if(!el.includes(filteredFields)) {
      object[el] = obj[el]
    }
  });
  
  return object;
}

exports.updateProfile = asyncError(async (req, res, next) => {
  
  // 1) Check if the user posted password or passwordConfirm in the body
  if(req.body.password || req.body.passwordConfirm) {
    return next(new QuoteError('This route is not for password update', 400))
  }
  
  // 2) Filter the body out
  let fields = { ...req.body };
  const object = filterBody(fields, 'role');
  
  if(req.file) {
    object.photo = req.file.filename;
  } else {
    object.photo = req.user.photo
  }
  
  // 3) update the user profile
  const user = await User.findByIdAndUpdate(req.user._id, object, {
    runValidator: true,
    new: true
  })
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
});

exports.profile = asyncError(async(req, res, next) => {
  
  const user = await User.findById(req.user._id);
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
});

exports.getAllUser = asyncError(async (req, res, next) => {
    const user = await User.find().populate('quote');
    
    res.status(200).json({
      status: 'success',
      result: user.length,
      data: {
        user
      }
    })
});

exports.getUser = asyncError(async (req, res, next) => {
    const user = await User.find({ _id: req.params.id }).populate({
      path: 'quote',
      options: { sort: { createdAt: -1 } }
    });
    
    if(!user) {
      return next(new QuoteError('No user found with that Id', 404))
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    })
});

exports.updateUser = asyncError(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true
    });
    
    if(!user) {
      return next(new QuoteError('No user found with that Id', 404))
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    })
});

exports.deleteUser = asyncError(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if(!user) {
      return next(new QuoteError('No user found with that Id', 404))
    }
    
    res.status(204).json({
      status: 'success'
    })
});