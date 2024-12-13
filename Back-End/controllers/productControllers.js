const Product = require("../models/product");
const User = require("../models/user");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs").promises;   
const path = require("path");

exports.addProduct = async (req, res) => {
  console.log("ioyiyooii", req.body);

  try {
    const {
      titleAr,
      description,
      price,
      category,
      details,
      handmade,
      size,
      materials,
    } = req.body;

    const mainImage = req.files["mainImage"]
      ? req.files["mainImage"][0].filename
      : null;
    const additionalImages = req.files["additionalImages"]
      ? req.files["additionalImages"].map((file) => file.filename)
      : [];
    const imageUrl = `http://localhost:${process.env.PORT}/uploads/${mainImage}`;

    // إنشاء المنتج الجديد
    const newProduct = new Product({
      titleAr,
      description,
      price: parseFloat(price),
      category,
      details,
      material: materials,
      isHandmade: handmade,
      size,
      mainImage: mainImage ? imageUrl : null,
      additionalImages: additionalImages.map(
        (img) => `http://localhost:${process.env.PORT}/uploads/${img}`
      ),
      seller: new mongoose.Types.ObjectId(req.user.id),
      // افتراض وجود معرف المستخدم في الطلب
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "تمت إضافة المنتج بنجاح",
      product: savedProduct,
    });
  } catch (error) {
    console.error("خطأ في إضافة المنتج:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء إضافة المنتج",
      error: error.message,
    });
  }
};
// -------------------------------------------------------------
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titleAr,
      description,
      price,
      category,
      details,
      handmade,
      size,
      materials,
      existingMainImage,
      existingAdditionalImages,
    } = req.body;

    // Find existing product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    // Function to delete old image from uploads
    const deleteOldImage = async (oldImageUrl) => {
      if (oldImageUrl) {
        try {
          const filename = path.basename(oldImageUrl);
          const filepath = path.join(__dirname, "../uploads", filename);
          await fs.unlink(filepath).catch(() => {});
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
    };

    // Handle main image
    let mainImageUrl = existingMainImage || product.mainImage;
    if (req.files && req.files["mainImage"]) {
      // Delete old main image
      await deleteOldImage(product.mainImage);

      const mainImage = req.files["mainImage"][0];
      mainImageUrl = `http://localhost:${process.env.PORT}/uploads/${mainImage.filename}`;
    }

    // Handle additional images
    let additionalImagesUrls =
      existingAdditionalImages || product.additionalImages;
    if (req.files && req.files["additionalImages"]) {
      // Delete old additional images
      await Promise.all(product.additionalImages.map(deleteOldImage));

      additionalImagesUrls = req.files["additionalImages"].map(
        (file) =>
          `http://localhost:${process.env.PORT}/uploads/${file.filename}`
      );
    }

    // Update product
    product.titleAr = titleAr;
    product.description = description;
    product.price = parseFloat(price);
    product.category = category;
    product.details = details;
    product.material = materials;
    product.isHandmade = handmade === "true" || handmade === true;
    product.size = size;
    product.mainImage = mainImageUrl;
    product.additionalImages = additionalImagesUrls;

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "تم تحديث المنتج بنجاح",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("خطأ في تحديث المنتج:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء تحديث المنتج",
      error: error.message,
    });
  }
};
// -------------------------------------------------------
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    // Delete all associated images
    const deleteImage = async (imageUrl) => {
      if (imageUrl) {
        try {
          const filename = path.basename(imageUrl);
          const filepath = path.join(__dirname, "../uploads", filename);
          await fs.unlink(filepath).catch(() => {});
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
    };

    // Delete main image
    await deleteImage(product.mainImage);

    // Delete additional images
    await Promise.all(product.additionalImages.map(deleteImage));

    res.status(200).json({
      message: "تم حذف المنتج بنجاح",
    });
  } catch (error) {
    console.error("خطأ في حذف المنتج:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء حذف المنتج",
      error: error.message,
    });
  }
};
// ----------------
exports.getProductForProvider = async (req, res) => {
  const providerId = req.user.id;

  try {
    // التحقق من صحة ObjectId
    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({
        status: "error",
        message: "معرّف المزود غير صالح",
      });
    }

    // جلب المنتجات الخاصة بالمزود
    const products = await Product.find({ seller: providerId });

    if (products.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "لا توجد منتجات لهذا المزود",
      });
    }

    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("خطأ أثناء جلب المنتجات للمزود:", error.message);
    res.status(500).json({
      status: "error",
      message: "حدث خطأ أثناء جلب المنتجات للمزود",
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    // جلب جميع المنتجات من قاعدة البيانات
    const products = await Product.find();

    // إرسال الاستجابة
    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // التحقق من صحة ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "معرّف المنتج غير صالح",
      });
    }

    // البحث عن المنتج
    const product = await Product.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "المنتج غير موجود أو تم حذفه",
      });
    }

    // إرسال المنتج
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("خطأ أثناء جلب المنتج:", error.message);
    res.status(500).json({
      status: "error",
      message: "حدث خطأ أثناء جلب المنتج",
      error: error.message,
    });
  }
};
