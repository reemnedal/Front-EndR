import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, User, Mail, Phone, FileText } from 'lucide-react';

const DriverApplication = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '', // Will contain driver-specific details
    resume: null // For driver's documents
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم الكامل مطلوب';
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

    // Validate message (driver details)
    if (formData.message.trim().length < 15) {
      newErrors.message = 'يرجى تقديم تفاصيل كافية عن خبرتك وسيارتك (15 حرف على الأقل)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('phoneNumber', formData.phoneNumber);
    submitData.append('message', formData.message);
    if (formData.resume) {
      submitData.append('resume', formData.resume);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/requests/driver', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      alert('تم تقديم طلب السائق بنجاح');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        message: '',
        resume: null
      });
    } catch (error) {
      alert(error.response?.data?.error || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-extrabold text-center text-[#6A1B9A] mb-8">
                  طلب انضمام كسائق توصيل
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="الاسم الكامل"
                      className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9C27B0] ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="رقم الهاتف"
                      className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9C27B0] ${
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
                      className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9C27B0] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Message/Details Textarea */}
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="الرجاء تقديم تفاصيل عن خبرتك في التوصيل ونوع السيارة التي تمتلكها"
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9C27B0] ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* File Upload */}
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center justify-center w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="mr-2 text-[#9C27B0]" />
                      <span className="text-gray-600">
                        {formData.resume ? formData.resume.name : 'رفع الوثائق (رخصة القيادة، تأمين المركبة)'}
                      </span>
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                      isSubmitting 
                        ? 'bg-[#CE93D8] cursor-not-allowed' 
                        : 'bg-[#9C27B0] hover:bg-[#7B1FA2]'
                    }`}
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'تقديم الطلب'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverApplication; 