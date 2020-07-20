const User = require('./../models/userModel');
const Quote = require('./../models/quoteModel');
const asyncError = require('./asyncError');
const QuoteError = require('./../utils/quoteError');

exports.getLandingPage = asyncError( async (req, res) => {
  const users = await User.find();
  const quotes = await Quote.find().populate({
    path: 'user',
    select: 'id name photo'
  }).sort({ createdAt: -1 });
  
  res.status(200).render('landing', {
    users,
    quotes,
    title: 'Welcome to this wonderful project'
  });
});

exports.getUserData = asyncError(async (req, res) => {
  
  const userData = await User.findOne({
    nickname: req.params.nickname
  }).populate('quote');
  
  res.status(200).render('user-data', {
    userData,
    title: `Quote | ${userData.nickname}`
  });
});

exports.login = (req, res) => {
  res.status(200).render('login', { title: 'Quote | Login' });
}

exports.signup = (req, res) => {
  res.status(200).render('signup', { title: 'Quote | Signup' });
}

exports.dashboard = (req, res) => {
  res.status(200).render('dashboard', { title: 'Quote | Dashboard' });
}

exports.createQuote = (req, res) => {
  res.status(200).render('createQuote', { title: 'Quote | Create Quote'});
}

exports.profile = (req, res) => {
  res.status(200).render('profile', { title: 'Profile'});
}

exports.updateProfile = (req, res) => {
  res.status(200).render('updateProfile', { title: 'Quote | Update Profile'});
}

exports.updatePassword = (req, res) => {
  res.status(200).render('updatePassword', { title: 'Quote | Update Password' });
}

exports.forgotPassword = (req, res) => {
  res.status(200).render('forgotPassword', { title: 'Quote | Forgot Password' });
}