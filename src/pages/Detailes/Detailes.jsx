
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  ArrowLeft,
  Check,
  Ruler,
  Palette,
  Clock,
  Truck,
} from "lucide-react";
import { fetchUser } from "../../redux/users/userThunk";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NavigationBar from "../../components/Layout/Navbar";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("يرجى تحديد التقييم");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `http://localhost:5000/api/review/products/${productId}/reviews`,
        { rating, comment },
        { withCredentials: true }
      );

      setRating(0);
      setComment("");

      onReviewAdded(response.data.review);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء إرسال التقييم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white/80 backdrop-blur-lg p-6 rounded-2xl"
    >
      <div>
        <label className="block mb-2 text-[#6A1B9A]">التقييم</label>
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-[#6A1B9A]">التعليق (اختياري)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-[#9C27B0] focus:border-[#9C27B0]"
          rows="4"
          placeholder="اكتب تقييمك هنا..."
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#9C27B0] text-white py-3 rounded-full hover:bg-[#7B1FA2] transition-colors"
      >
        {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
      </button>
    </form>
  );
};

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const {
    user,
    loading: userLoading,
    error: userError,
    isAuthenticated,
  } = useSelector((state) => state.user);
  // Use the custom hook for fetching appointments

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  console.log(user);
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(response.data.data.product);
        setReviews(response.data.data.product.reviews || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);


  
  useEffect(() => {
    const fetchProductQuantity = async () => {
        try {
            const storedQuantity = localStorage.getItem(`quantity_${id}`);
            if (storedQuantity) {
                setQuantity(Number(storedQuantity));  // Use the stored quantity if available
            } else {
                const response = await axios.get(`http://localhost:5000/api/user/cartQ/${id}`, {
                    withCredentials: true,
                });

                if (response.data.quantity) {
                    setQuantity(response.data.quantity);
                    localStorage.setItem(`quantity_${id}`, response.data.quantity);  // Store in localStorage
                }
            }
        } catch (err) {
            console.error('Error fetching quantity:', err);
        }
    };

    fetchProductQuantity();
}, [id]);


const addToCart = async () => {
  try {
      setIsAddingToCart(true);

      if (!product) {
          throw new Error('المنتج غير متوفر');
      }

      const cartData = {
          items: [{
              product: id,
              quantity: quantity,
              price: product.price
          }]
      };

      console.log('Sending cart data:', cartData);

      const response = await axios.post('http://localhost:5000/api/user/addToCart', cartData, {
          withCredentials: true,
      });

      alert('تمت إضافة المنتج إلى السلة بنجاح');

  } catch (err) {
      console.error('Detailed Error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
      });

      alert(`حدث خطأ أثناء إضافة المنتج للسلة: ${err.response?.data?.message || err.message}`);
  } finally {
      setIsAddingToCart(false);
  }
};

  const handleReviewAdded = (newReview) => {
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);

    const averageRating = updatedReviews.length
      ? (
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
          updatedReviews.length
        ).toFixed(1)
      : 0;

    setProduct((prev) => ({
      ...prev,
      reviews: updatedReviews,
      averageRating: parseFloat(averageRating),
    }));
  };

  const onBackToCatalog = () => {
    navigate("/");
  };

  const generateProductSpecs = (product) => {
    return [
      {
        icon: <Ruler className="w-6 h-6 text-[#9C27B0]" />,
        label: "الحجم",
        value: product.size,
      },
      {
        icon: <Palette className="w-6 h-6 text-[#9C27B0]" />,
        label: "المادة",
        value: product.material,
      },
      {
        icon: <Clock className="w-6 h-6 text-[#9C27B0]" />,
        label: "نوع المنتج",
        value: product.isHandmade ? "منتج يدوي" : "منتج تجاري",
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        جار التحميل...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        حدث خطأ: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        لم يتم العثور على المنتج
      </div>
    );
  }

  const productImages = [
    product.mainImage,
    ...(product.additionalImages || []).slice(0, 3),
  ];

  const productSpecs = generateProductSpecs(product);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#E1F5FE] to-[#FFF3E0] py-12"
      style={{ fontFamily: "Cairo, Arial, sans-serif" }}
    >      <NavigationBar/>

      <div className="container mx-auto px-6">
        <button
          onClick={onBackToCatalog}
          className="flex items-center text-[#6A1B9A] mb-6 hover:text-[#9C27B0] transition-colors"
        >
          <ArrowLeft className="ml-2" />
          العودة للكتالوج
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* قسم الصور */}
          <div>
            <div className="relative">
              <img
                src={productImages[selectedImage]}
                alt="صورة المنتج"
                className="w-full rounded-2xl shadow-2xl transform transition-all hover:scale-105"
              />
            
            </div>

            {/* معاينة الصور */}
            <div className="flex justify-center space-x-4 mt-6  ">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-[#9C27B0]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`معاينة ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* قسم تفاصيل المنتج */}
          <div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-[#4A4A4A]">
                  {product.titleAr}
                </h1>
                <div className="flex items-center bg-[#9C27B0]/20 text-[#9C27B0] px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 ml-2" />
                  {product.averageRating || 0}
                </div>
              </div>

              <p className="text-[#757575] mb-6">{product.description}</p>

              {/* المواصفات */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {productSpecs.map((spec, index) => (
                  <div
                    key={index}
                    className="bg-[#F3E5F5]/50 p-4 rounded-xl text-center"
                  >
                    <div className="flex justify-center mb-2">{spec.icon}</div>
                    <p className="text-[#4A4A4A] font-bold">{spec.label}</p>
                    <p className="text-[#757575] text-sm">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="bg-[#9C27B0]/10 text-[#9C27B0] w-10 h-10 rounded-full"
                                    >
                                        -
                                    </button>
                                    <span className="text-2xl font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="bg-[#9C27B0]/10 text-[#9C27B0] w-10 h-10 rounded-full"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-3xl font-bold text-[#9C27B0]">
                                    {product.price * quantity} دينار
                                </span>
                            </div>

              {/* السعر والكمية */}
              {/* <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="bg-[#9C27B0]/10 text-[#9C27B0] w-10 h-10 rounded-full"
                                    >
                                        -
                                    </button>
                                    <span className="text-2xl font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="bg-[#9C27B0]/10 text-[#9C27B0] w-10 h-10 rounded-full"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-3xl font-bold text-[#9C27B0]">
                                    {product.price * quantity} ر.س
                                </span>
                            </div> */}

              {/* زر الشراء */}
              {/* <button
                disabled={product.stock === 0}
                className={`w-full text-white py-4 rounded-full hover:bg-[#7B1FA2] transition-colors flex items-center justify-center space-x-4 ${
                  product.stock > 0
                    ? "bg-[#9C27B0]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={24} />
                <span>
                  {product.stock > 0 ? "أضف إلى السلة" : "نفذت الكمية"}
                </span>
              </button> */}




<div className="flex justify-between space-x-4">
                                <button
                                    onClick={addToCart}
                                    disabled={isAddingToCart}
                                    className={`w-full py-3 px-6 rounded-xl text-white ${
                                        isAddingToCart
                                            ? 'bg-[#9C27B0]/60 cursor-not-allowed'
                                            : 'bg-[#9C27B0] hover:bg-[#8E24AA]'
                                    }`}
                                >
                                    {isAddingToCart ? 'إضافة للسلة...' : 'أضف للسلة'}
                                </button>
                            </div>
              {/* مميزات إضافية */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-[#4A4A4A]">
                  <Check className="w-5 h-5 ml-2 text-green-500" />
                  شحن مجاني للطلبات فوق ٢٠٠ د.أ
                </div>
                <div className="flex items-center text-[#4A4A4A]">
                  <Truck className="w-5 h-5 ml-2 text-[#9C27B0]" />
                  توصيل خلال ٣-٥ أيام عمل
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* قسم التقييمات والوصف الإضافي */}
        <div className="mt-16 bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-2xl">
          <div className="mt-16 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[#6A1B9A] mb-6">
                وصف المنتج
              </h2>
              <p className="text-[#757575] leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#6A1B9A] mb-6">
                التقييمات ({reviews.length} تقييم)
              </h2>

              <ReviewForm productId={id} onReviewAdded={handleReviewAdded} />

              <div className="space-y-4 mt-6">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="bg-[#F3E5F5]/50 p-4 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-[#4A4A4A]">
                          {user?.username || "مستخدم مجهول"}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#757575]">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#757575] text-center">
                    لا توجد تقييمات حتى الآن
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
