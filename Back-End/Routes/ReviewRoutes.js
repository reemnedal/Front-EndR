const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');
const auth = require('../middleware/authMiddleware');

// إضافة تقييم جديد للمنتج
router.post('/products/:productId/reviews', auth, reviewController.createReview); 

// جلب جميع تقييمات المنتج
router.get('/products/:productId/reviews', reviewController.getProductReviews);

module.exports = router;