const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const auth = require("../middleware/authMiddleware");

router.post("/create", testimonialController.createTestimonial);
router.get("/all", testimonialController.getAllTestimonials);
router.put("/toggle-status/:id", auth, testimonialController.toggleTestimonialStatus);

module.exports = router; 