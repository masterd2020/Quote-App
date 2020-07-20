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
  love: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Query Middleware
quoteSchema.pre(/^find/, function (next) {
  this.sort({ createdAt: -1 });
  next();
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;