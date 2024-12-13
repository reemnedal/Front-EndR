const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const auth = require("../middleware/authMiddleware");

router.post("/send", contactController.sendMessage);  
router.get("/messages",  contactController.getMessages);

module.exports = router; 