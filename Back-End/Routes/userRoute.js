const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userControllers");
const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51Pq8qdRr1S70aw7OIrwox6pbdjm1qhBkxjY32emZ3EMGEPhojwTqoR8owtQKpCR69WUh8Vs7kKzh0c8tPW5ae7iD00gMmrPG8u");
const auth = require("../middleware/authMiddleware");
const ProviderApplication = require("../models/providerApplication");
const multer = require("multer");
const path = require("path");
const upload = require("../config/multer-config");
const Cart = require("../models/cart"); // Adjust the path to your Cart model
const Product = require("../models/product"); // Adjust the path to your Product model
const User = require("../models/user"); // Adjust the path to your Product model
const Order = require('../models/order');
const { getUserProfile, updateUserProfile } = require("../controllers/userprofile");
// const { getProductQuantityInCart } = require("../controllers/getQuantity");

const mongoose = require('mongoose');


router.post("/register/user", userController.registerUser);
router.post("/login/user", userController.loginUser);
router.get("/get", auth, userController.getUserById);
router.put("/update", auth, userController.updateUser);
router.put(
  "/update/image",
  auth,
  upload.single("image"),
  userController.updateImageUserData
);
// Check cookies route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/provider_applications/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
  },
});

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const allowedFileTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedFileTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimetype = allowedFileTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb("Error: Only images are allowed!");
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
// });

router.get("/userprofile", auth, getUserProfile);

// Update user profile
router.put("/userprofile", auth, updateUserProfile);

router.post("/providerApplication", auth, async (req, res) => {
  const userId = req.user.id; // Assuming middleware populates req.user
  console.log("this is value of userId i wish this is not null ", userId);
  const {
    fullName,
    phoneNumber,
    email,
    address,
    productType,
    skillsDescription,
    productImages,
    socialMediaLinks,
  } = req.body;

  try {
    const newApplication = new ProviderApplication({
      fullName,
      phoneNumber,
      email,
      address,
      productType,
      skillsDescription,
      productImages,
      socialMediaLinks,
      userId,
    });

    await newApplication.save();
    res
      .status(201)
      .json({ message: "Application submitted successfully", newApplication });
  } catch (error) {
    console.error("Submission error:", error); // Add error logging
    res.status(500).json({ error: error.message });
  }
});



router.post("/addToCart", auth, async (req, res) => {
  try {
    // User ID from authenticated middleware
    const userId = req.user.id;

    // Check if there are items in the request
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Initialize an array to store the items and their respective sellers (providers)
    const itemsWithSeller = [];

    // Loop through each item in the request and fetch the seller (provider) from the product table
    for (const item of req.body.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          message: `Product with ID ${item.product} not found`,
        });
      }
      // Add the product, quantity, price, and seller info
      itemsWithSeller.push({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        seller: product.seller, // Seller ID (provider) from the product
      });
    }

    // Get the seller (provider) of the first item in the request
    const newProvider = itemsWithSeller[0]?.seller;
    if (!newProvider) {
      return res.status(400).json({ message: "No provider found for the items" });
    }

    console.log("newProvider:", newProvider); // Debugging log

    // Find the user's existing cart and populate the username field
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "user",
      select: "username", // Populate the username field only
    });

    if (cart) {
      // If cart exists, check if it's already associated with a different provider
      console.log("Existing cart provider:", cart.provider); // Debugging log

      if (cart.provider && cart.provider.toString() !== newProvider.toString()) {
        return res.status(400).json({
          message: "You can only add items from one provider. Please clear your cart first.",
        });
      }
    } else {
      // If no cart exists, create a new one with the provider from the first item
      cart = new Cart({
        user: userId,
        items: [],
        total: 0,
        provider: newProvider,
      });
    }

    // Add the items to the cart
    for (const item of itemsWithSeller) {
      // Check if the product is already in the cart
      const existingItemIndex = cart.items.findIndex(
        (cartItem) => cartItem.product.toString() === item.product.toString()
      );
      if (existingItemIndex > -1) {
        // Update the quantity by adding the new quantity to the existing quantity
        cart.items[existingItemIndex].quantity += item.quantity;

        // Preserve the original per-item price
        cart.items[existingItemIndex].price =
          cart.items[existingItemIndex].quantity * (item.price / item.quantity);
      } else {
        // Add the new product to the cart with the correct per-item price
        cart.items.push({
          product: item.product,
          quantity: item.quantity,
          price: item.quantity * (item.price / item.quantity), // Ensure per-item price is preserved
        });
      }

    }

    // Recalculate the total price
    cart.total = cart.items.reduce((sum, item) => sum + item.price, 0);

    // Save the cart data
    await cart.save();

    // Send the response
    res.status(200).json({
      message: "Added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({
      message: "Error adding to cart",
      error: error.message,
    });
  }
});



// Get user's cart
router.get("/cart", auth, async (req, res) => {
  try {
      const cart = await Cart.findOne({ user: req.user.id })
          .populate({
              path: 'items.product',
              select: 'titleAr mainImage price'
          });

      res.json(cart || { items: [] });
  } catch (error) {
      res.status(500).json({ message: "Error fetching cart" });
  }
});

// Update item quantity
router.put("/cart/update-quantity", auth, async (req, res) => {
  try {
      const { productId, quantity } = req.body;

      const cart = await Cart.findOne({ user: req.user.id });

      const itemIndex = cart.items.findIndex(
          item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;

          // Recalculate total price
          cart.total = cart.items.reduce(
              (sum, item) => sum + (item.price * item.quantity),
              0
          );

          await cart.save();
          res.json(cart);
      } else {
          res.status(404).json({ message: "Item not found in cart" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error updating quantity" });
  }
});

// Remove item from cart
router.delete("/cart/remove/:productId", auth, async (req, res) => {
  try {
      const cart = await Cart.findOne({ user: req.user.id });

      cart.items = cart.items.filter(
          item => item.product.toString() !== req.params.productId
      );

      // Recalculate total price
      cart.total = cart.items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
      );

      await cart.save();
      res.json(cart);
  } catch (error) {
      res.status(500).json({ message: "Error removing item" });
  }
});



const axios = require('axios');


router.post("/create", auth, async (req, res) => {
  try {
    const {
      items,
      total,
      paymentMethod,
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      stripePaymentMethodId,
    } = req.body;

    // Stripe payment processing
    let stripeCharge = null;
    if (paymentMethod === "stripe" && stripePaymentMethodId) {
      stripeCharge = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: "usd",
        payment_method: stripePaymentMethodId,
        confirm: true,
         return_url: 'http://localhost:5000'
      });
    }

    // Ensure items array is not empty
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    // Get the provider ID from the first item's product
    const firstProductId = items[0]?.product?._id;
    if (!firstProductId) {
      return res.status(400).json({ message: "Invalid product ID in items" });
    }

    const product = await Product.findById(firstProductId).select("seller");
    if (!product || !product.seller) {
      return res.status(404).json({ message: "Product or provider not found" });
    }

    const providerId = product.seller;

    // Create new order
    const userId = req.user.id;
    const newOrder = new Order({
      user: userId,
      provider: providerId, // Use the retrieved provider ID
      items: items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      firstName,
      lastName,
      email,
      phone,
      deliveryAddress: {
        street,
        city,
        state,
        zipCode,
      },
      paymentMethod,
      platformProfit: total * 0.1, // 10% platform profit
      providerProfit: total * 0.9, // 90% to provider
    });

    console.log("Order items:", items);
    await newOrder.save();

    // Clear user's cart after order
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], total: 0 }
    );

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
      stripePaymentDetails: stripeCharge,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
});


router.get('/orders', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Populate order with product details
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name description' // Select only specific product fields
      })
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});
module.exports = router;
