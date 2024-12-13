const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.cookies.token;

  console.log("Received token:", token);
  try {
    if (!token) {
      return res
        .status(201)
        .json({ loggedIn: false, message: "You must be logged in" });
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    req.body.userId = user.id;
    console.log("Token verified successfully. User ID:", req.user);
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(500).send("Error verifying token: " + error.message);
  }
};
module.exports = auth;
