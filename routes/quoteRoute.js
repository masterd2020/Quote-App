const express = require('express');

const quoteController = require('./../controllers/quoteController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/updateLove/:id')
  .patch(quoteController.updateLove);

router
  .route('/')
  .get(quoteController.getAllQuote)
  .post(authController.protect, quoteController.createQuote);
  
router
  .route('/:id')
  .get(quoteController.getQuote)
  .patch(authController.protect, quoteController.updateQuote)
  .delete(authController.protect, quoteController.deleteQuote);
  
  
module.exports = router;