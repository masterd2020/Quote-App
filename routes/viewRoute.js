const express = require('express');

const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewController');

const router = express.Router();

router.use(authController.isLoggedIn)

router.get('/', viewController.getLandingPage);

router.get('/user/:nickname', viewController.getUserData);

router.get('/login', viewController.login);

router.get('/signup', viewController.signup);

router.get('/dashboard', authController.protect, viewController.dashboard);

router.get('/create-quote', authController.protect, viewController.createQuote);

router.get('/profile', authController.protect, viewController.profile);

router.get('/update-profile', authController.protect, viewController.updateProfile);

router.get('/update-password', authController.protect, viewController.updatePassword);

router.get('/forgotPassword', viewController.forgotPassword);
  
module.exports = router;