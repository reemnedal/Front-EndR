const User = require("../models/user"); // Path to your User model

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from auth middleware
    const user = await User.findById(userId).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from auth middleware
    const updates = req.body; // Expect profile updates from the request body

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password"); // Exclude password field

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
