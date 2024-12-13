const Order = require("../models/order"); // استيراد نموذج الـ Order

// الحصول على كل الطلبات
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // يمكننا استخدام populate لملء البيانات المرتبطة
      .populate("provider", "name serviceType")
      .populate("items.product", "name price"); // Populate المنتجات في كل طلب

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { providerStatus } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // تحديث حالة الطلب
    order.providerStatus = providerStatus;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};