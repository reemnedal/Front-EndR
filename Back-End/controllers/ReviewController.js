const Product = require('../models/product');

exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'التقييم يجب أن يكون بين 1 و 5'
      });
    }

    // Find the product and check if exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'المنتج غير موجود'
      });
    }

    // Check if user has already reviewed this product
    const existingReviewIndex = product.reviews.findIndex(
      review => review.user.toString() === userId
    );

    if (existingReviewIndex !== -1) {
      return res.status(400).json({
        status: 'error',
        message: 'لقد قمت بتقييم هذا المنتج مسبقًا'
      });
    }

    // Create new review
    const newReview = {
      user: userId,
      rating,
      comment,
      createdAt: new Date()
    };

    // Add review to product
    product.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating, 
      0
    );
    product.averageRating = totalRating / product.reviews.length;

    // Save the updated product
    await product.save();

    res.status(201).json({
      status: 'success',
      message: 'تم إضافة التقييم بنجاح',
      review: newReview
    });
  } catch (error) {
    console.error('خطأ في إنشاء التقييم:', error);
    res.status(500).json({
      status: 'error',
      message: 'حدث خطأ أثناء إنشاء التقييم',
      error: error.message
    });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find product and populate user details in reviews
    const product = await Product.findById(productId)
      .populate('reviews.user', 'username'); // Adjust based on your User model

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'المنتج غير موجود'
      });
    }

    res.status(200).json({
      status: 'success',
      results: product.reviews.length,
      reviews: product.reviews
    });
  } catch (error) {
    console.error('خطأ في جلب التقييمات:', error);
    res.status(500).json({
      status: 'error',
      message: 'حدث خطأ أثناء جلب التقييمات',
      error: error.message
    });
  }
};