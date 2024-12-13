// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const authMiddleware = require('../middlewares/authMiddleware');

// // المسارات العامة
// router.route('/')
//   .get(productController.getAllProducts) // الحصول على جميع المنتجات
//   .post(
//     authMiddleware.protect,
//     productController.createProduct // إنشاء منتج جديد (للمستخدمين المصرح لهم)
//   );

const express = require("express");
const productController = require("../controllers/productControllers");
const { protect } = require("../middleware/authMiddleware");
const auth = require("./../middleware/authMiddleware");
const router = express.Router();
const upload = require("../config/multer-config");
const productUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "additionalImages", maxCount: 3 },
]);
// إنشاء منتج جديد

router.post("/add", auth, productUpload, productController.addProduct);

// الحصول على جميع المنتجات
router.get("/all", productController.getAllProducts);   

// // الحصول على منتج محدد
router.get("/get", auth, productController.getProductForProvider);
router.get("/:id", productController.getProductById);

router.put("/update/:id", auth,  productUpload, productController.updateProduct);
router.delete('/delete/:id',  auth,  productController.deleteProduct);

// // تحديث منتج
// router.patch("/:id", protect, productController.updateProduct);

// // حذف منتج
// router.delete("/:id", protect, productController.deleteProduct);

// // إضافة تقييم للمنتج
// router.post("/:id/review", protect, productController.addReview);

module.exports = router;
