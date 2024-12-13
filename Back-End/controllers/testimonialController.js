const Testimonial = require("../models/Testimonial");

exports.createTestimonial = async (req, res) => {
  try {
    const { author, email, text, rating } = req.body;
    
    const newTestimonial = new Testimonial({
      author,
      email,
      text,
      rating
    });

    await newTestimonial.save();

    res.status(201).json({
      success: true,
      message: "تم إضافة تقييمك بنجاح"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء إضافة التقييم"
    });
  }
};

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب التقييمات"
    });
  }
};



exports.toggleTestimonialStatus = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: "لم يتم العثور على التقييم"
      });
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "تم تحديث حالة التقييم بنجاح"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء تحديث حالة التقييم"
    });
  }
}; 