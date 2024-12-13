const Request = require("../models/Request");

exports.createDriverRequest = async (req, res) => {
  try {
    const { name, email, phoneNumber, message } = req.body;
    
    const request = new Request({
      name,
      email,
      phoneNumber,
      message,
      resume: req.file ? `/uploads/${req.file.filename}` : undefined,
      status: 'pending'
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: "تم تقديم طلب السائق بنجاح",
      request
    });
  } catch (error) {
    console.error("Driver application error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء تقديم الطلب"
    });
  }
};

// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ submissionDate: -1 });
    res.status(200).json({
      success: true,
      requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب الطلبات"
    });
  }
};

// Update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "الطلب غير موجود"
      });
    }

    res.status(200).json({
      success: true,
      message: "تم تحديث حالة الطلب بنجاح",
      request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء تحديث حالة الطلب"
    });
  }
}; 