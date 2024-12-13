const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController"); // استيراد المتحكم

// الحصول على كل الطلبات
router.get("/orders", orderController.getAllOrders);

// الحصول على طلب معين باستخدام ID
router.put("/update/:orderId", orderController.updateOrderStatus);

module.exports = router;
