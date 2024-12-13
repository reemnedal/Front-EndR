const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./../models/user");
const ProviderApplication = require("./../models/application");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      isDeleted: false,
      //   isActive: true,
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password, or account is inactive or deleted",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    res.status(200).json({ message: "User logged in successfully!" });
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
};
// ---------------------------------------------------------------------
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    res.cookie("userId", newUser._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    res
      .status(201)
      .json({ message: "User registered successfully (First Method)!" });
  } catch (error) {
    res
      .status(500)
      .send("Error registering user (First Method): " + error.message);
  }
};
// ---------------------------------------------------------------------
exports.getUserById = async (req, res) => {
  const userId = req.user.id;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userData = await User.findById(userId).populate(
      "ProviderApplication"
    );

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = {
      ...userData.toObject(),
      ProviderApplication: userData.ProviderApplication || null,
    };

    res.status(200).json({ user, loggedIn: true });
  } catch (error) { 
    res
      .status(500)
      .json({ message: "Error fetching user data: " + error.message });
  }
};

// --------------------------------------
// exports.updateImageUserData = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // حذف الصورة القديمة إن وجدت
//     if (user.profilePicture) {
//       const oldImagePath = path.join(__dirname, "../", user.profilePicture);
//       if (fs.existsSync(oldImagePath)) {
//         fs.unlinkSync(oldImagePath);
//       }
//     }

//     const fileExtension = path.extname(req.file.originalname);
//     const newFileName = `profilePicture-${Date.now()}${fileExtension}`;
//     const newFilePath = path.join(__dirname, "../uploads", newFileName);

//     fs.renameSync(req.file.path, newFilePath);

//     const fullPath = `http://localhost:${process.env.PORT}/uploads/${newFileName}`;
//     user.Picture = fullPath;

//     await user.save();

//     res.status(200).json({
//       message: "Profile image updated successfully",
//       userId,
//       newImagePath: fullPath,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating profile image", error });
//   }
// };
exports.updateImageUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let oldFileName = null;
    if (user.Picture) {
      try {
        oldFileName = path.basename(new URL(user.Picture).pathname);
        const oldImagePath = path.join(__dirname, "../uploads", oldFileName);

        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log(`Old image ${oldFileName} deleted successfully`);
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
          }
        }
      } catch (urlError) {
        console.error("Error processing old image URL:", urlError);
      }
    }

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const newFileName = `Picture-${Date.now()}${fileExtension}`;
    const newFilePath = path.join(__dirname, "../uploads", newFileName);

    try {
      fs.renameSync(req.file.path, newFilePath);
    } catch (renameError) {
      console.error("Error moving the file:", renameError);
      return res
        .status(500)
        .json({ message: "Error moving the file", error: renameError });
    }

    const fullPath = `http://localhost:${process.env.PORT}/uploads/${newFileName}`;
    user.Picture = fullPath;

    try {
      await user.save();
    } catch (saveError) {
      console.error("Error saving user data:", saveError);
      return res
        .status(500)
        .json({ message: "Error saving user data", error: saveError });
    }

    res.status(200).json({
      message: "Profile image updated successfully",
      userId,
      newImagePath: fullPath,
    });
  } catch (error) {
    console.error("Error in updateImageUserData:", error);
    res.status(500).json({
      message: "Error updating profile image",
      error: error.message,
      stack: error.stack,
    });
  }
};
// -----------------------------
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, aboutMe } = req.body;

    // Check if both fields are provided
    if (!username && !aboutMe) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the username if it's provided
    if (username) {
      user.username = username;
    }

    // Update the aboutMe if it's provided
    if (aboutMe) {
      user.aboutMe = aboutMe;
    }

    // Save the updated user data
    await user.save();

    res.status(200).json({
      message: "User data updated successfully",
      updatedUser: {
        username: user.username,
        aboutMe: user.aboutMe,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user data",
      error: error.message,
    });
  }
};
