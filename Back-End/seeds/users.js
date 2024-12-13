const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/user"); // Adjust the path to your `user` model

dotenv.config(); // Load environment variables

const seedUsers = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected!");

    // Seed data
    const users = [
      {
        username: "john_doe",
        email: "john.doe@example.com",
        password: "securepassword123", // Ideally, hash the password
        profilePicture: "john.png",
        role: "user",
        bio: "Love reading books!",
        isActivated: true,
      },
      {
        username: "jane_smith",
        email: "jane.smith@example.com",
        password: "anothersecurepassword",
        role: "provider",
        bio: "Author of multiple bestsellers.",
        isActivated: true,
      },
      {
        username: "driver_bob",
        email: "bob.driver@example.com",
        password: "driverpassword",
        role: "driver",
        bio: "I deliver books with care!",
        isActivated: true,
      },
    ];

    // Insert users into the database
    await User.insertMany(users);
    console.log("Users seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1); // Exit process with failure
  }
};

// Run the seed script
seedUsers();
