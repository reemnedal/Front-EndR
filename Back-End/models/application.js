// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const providerApplicationSchema = new Schema(
//   {
//     user: { type: Schema.Types.ObjectId, ref: "User", required: false },
//     bio: { type: String, required: false },
//     resume: { type: String },
//     yearsOfExperience: { type: Number, required: false },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },
//     adminNotes: { type: String },
//   },
//   { timestamps: true }
// );

// const ProviderApplication =
//   mongoose.models.ProviderApplication ||
//   mongoose.model("ProviderApplication", providerApplicationSchema);

// module.exports = ProviderApplication;
