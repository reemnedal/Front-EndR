import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, User, Mail, Phone, MapPin, Palette, ShoppingBag, Shirt, Utensils, Anchor, MoreHorizontal, Link } from 'lucide-react';

const ProviderApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    productType: '', // Single product type
    skillsDescription: '',
    productImages: [],
    socialMediaLinks: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const productTypes = [
    { value: 'مصنوعات يدوية', icon: Anchor },
    { value: 'ملابس', icon: Shirt },
    { value: 'طعام', icon: Utensils },
    { value: 'إكسسوارات', icon: ShoppingBag },
    { value: 'أخرى', icon: MoreHorizontal }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }

    // Validate phone number

    const phoneRegex = /^(07|5|\+962)\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'يرجى إدخال رقم هاتف صحيح';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    // Validate product type
    if (!formData.productType) {
      newErrors.productType = 'يرجى اختيار نوع المنتج';
    }

    // Validate skills description
    if (formData.skillsDescription.trim().length < 20) {
      newErrors.skillsDescription = 'يجب أن يكون وصف المهارات أكثر تفصيلاً (20 حرف على الأقل)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData({ 
      ...formData, 
      productImages: [...formData.productImages, ...imageUrls] 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
        const response = await axios.post('http://localhost:5000/api/user/providerApplication', formData, {
            withCredentials: true
          });

      alert('تم تقديم الطلب بنجاح');
    } catch (error) {
      alert(error.response?.data?.error || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r bg-primary hover:bg-primary-hover shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-full mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
              نموذج تقديم المزود
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* First Column */}
              <div className="space-y-6">
                {/* Full Name Input */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="الاسم الكامل"
                    className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:outline-none ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="رقم الهاتف"
                    className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:outline-none ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="البريد الإلكتروني"
                    className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:outline-none ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Address Input */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="العنوان"
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Second Column */}
              <div className="space-y-6">
                {/* Product Types Radio Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع المنتج
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {productTypes.map(({ value, icon: Icon }) => (
                      <label
                        key={value}
                        className={`inline-flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                          formData.productType === value
                            ? 'bg-blue-100 border-2 border-blue-500'
                            : 'bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <input
                          type="radio"
                          value={value}
                          checked={formData.productType === value}
                          onChange={() => setFormData({
                            ...formData,
                            productType: value
                          })}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center">
                          <Icon className="mb-1 text-gray-600" />
                          <span className="text-sm">{value}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.productType && (
                    <p className="text-red-500 text-sm mt-1">{errors.productType}</p>
                  )}
                </div>

                {/* Skills Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف المهارات
                  </label>
                  <textarea
                    name="skillsDescription"
                    value={formData.skillsDescription}
                    onChange={handleInputChange}
                    placeholder="أدخل وصفًا مفصلاً لمهاراتك"
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                      errors.skillsDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.skillsDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.skillsDescription}</p>
                  )}
                </div>

                {/* Product Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صور المنتجات
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg "
                    >
                      <Upload className="mr-2" /> رفع الصور
                    </button>
                  </div>
                  {formData.productImages.length > 0 && (
                    <div className="mt-2 flex space-x-2">
                      {formData.productImages.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Media Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    روابط وسائل التواصل الاجتماعي
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="socialMediaLinks"
                      value={formData.socialMediaLinks.join(',')}
                      onChange={(e) => setFormData({ 
                        ...formData,
                        socialMediaLinks: e.target.value.split(',') 
                      })}
                      placeholder="أدخل الروابط مفصولة بفواصل"
                      className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                    isSubmitting 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-hover'
                  }`}
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderApplicationForm;