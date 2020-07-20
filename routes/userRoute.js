const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();


router
  .route('/signup')
  .post(authController.uploadUserPhoto, authController.signup);

router
  .route('/login')
  .post(authController.login);

router.get('/logout', authController.logout);

router
  .route('/forgotPassword')
  .post(authController.forgotPassword);
  
router
  .route('/resetPassword/:resetToken')
  .patch(authController.resetPassword);

router
  .route('/updateMyPassword')
  .patch(authController.protect, authController.updateMyPassword);

router
  .route('/updateProfile')
  .patch(authController.protect, authController.uploadUserPhoto, userController.updateProfile);

router
  .route('/profile')
  .get(authController.protect, userController.profile);

// Only For Administrator

// All the route after this Middleware are protected and restrictTo admin

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUser)
  .post();
  
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
  
  
module.exports = router;