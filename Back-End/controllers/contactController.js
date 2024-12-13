const ContactMessage = require("../models/ContactMessage");

exports.sendMessage = async (req, res) => {
  try {
    const { from, subject, message, email } = req.body;
    
    const newMessage = new ContactMessage({
      from,
      subject,
      message,
      email
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "تم إرسال رسالتك بنجاح"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء إرسال الرسالة"
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ date: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب الرسائل"
    });
  }
}; 