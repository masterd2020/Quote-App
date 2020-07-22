const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  quote: {
    type: String,
    required: [true, 'Please provide your quote'],
    unique: true
  },
  author: {
    type: String
  },
  tag: {
    type: String,
    enum: {
      values: ["work", "success", "motivational"],
      message: "please specify only: work, success, motivational in lower case"
    }
  },
  love: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now())
  }
});
/*
quoteSchema.pre('save', function (next) {
  if(this.author) {
    return next();
  }
  
  this.author = this.user
  next()
})*/

// Query Middleware
quoteSchema.pre(/^find/, function (next) {
  this.sort({ createdAt: -1 });
  next();
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;