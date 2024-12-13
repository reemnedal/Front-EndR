const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: String,
    role: {
      type: String,
      enum: ["user", "provider", "driver"],
      default: "user",
    },
    bio: String,
    phoneNumber: { type: String },
    Picture: { type: String },
    aboutMe: { type: String },
    ProviderApplication: {
      type: Schema.Types.ObjectId,
      ref: "ProviderApplication",
    },
    savedBooks: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    publishedBooks: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    googleId: { type: String },
    facebookId: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActivated: { type: Boolean, default: false }, // Default to false
    otp: String,
    otpExpiry: Date,
  },

  { timestamps: true }
);
const User =
  mongoose.models.User || mongoose.model("User", userSchema, "Users");
module.exports = User;
