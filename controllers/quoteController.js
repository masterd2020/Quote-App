const Quote = require('./../models/quoteModel');
const asyncError = require('./asyncError');
const QuoteError = require('./../utils/quoteError');

exports.updateLove = asyncError(async (req, res, next) => {
  const quote = await  Quote.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      quote
    }
  })
})

exports.createQuote = asyncError(async (req, res, next) => {
  
  // Set the user id to the current logged in user
  req.body.user = req.user._id;
  
  const quote = await Quote.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      quote
    }
  });
})

exports.getAllQuote = asyncError(async (req, res, next) => {
  
  const quote = await Quote.find().populate({
    path: 'user',
    select: '_id name photo'
  }).sort({createdAt: -1});
  
  res.status(201).json({
    status: 'success',
    result: quote.length,
    data: {
      quote
    }
  });
})


exports.getQuote = asyncError(async (req, res, next) => {
  
  const quote = await Quote.findById(req.params.id).sort('$createdAt');
  
  res.status(200).json({
    status: 'success',
    data: {
      quote
    }
  });
})


exports.updateQuote = asyncError(async (req, res, next) => {
  
  const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      quote
    }
  });
})


exports.deleteQuote = asyncError(async (req, res, next) => {
  /*
  const checkQuote = await Quote.findById(req.params.id);

  // check if the quote belongs to the logged in user
  //console.log(req.user);
  if(checkQuote.user !== req.user._id) {
    return next(new QuoteError('You cannot delete another person quote', 400))
  }
  */
  const quote = await Quote.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    status: 'success'
  });
})

