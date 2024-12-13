import React, { useState } from 'react';
import axios from 'axios';
import { Star, Send, Phone, Mail, MapPin } from 'lucide-react';
import NavigationBar from '../../components/Layout/Navbar';

const inputClasses = "w-full px-3 py-2 mt-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9C27B0] focus:border-transparent transition duration-200 text-right";
const buttonClasses = "w-full bg-[#9C27B0] text-white px-4 py-2 rounded-md hover:bg-[#7B1FA2] focus:outline-none focus:ring-2 focus:ring-[#9C27B0] focus:ring-offset-2 transition duration-200";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: '',
    isTestimonial: false,
    rating: 5
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (formData.isTestimonial) {
        await axios.post('http://localhost:5000/api/testimonials/create', {
          text: formData.message,
          author: formData.name,
          rating: formData.rating,
          email: formData.email
        });
        setSuccess('شكراً لمشاركة تجربتك! سيتم مراجعتها من قبل فريقنا.');
      } else {
        await axios.post('http://localhost:5000/api/contact/send', {
          from: formData.name,
          subject: formData.subject,
          message: formData.message,
          email: formData.email,
        });
        setSuccess('تم إرسال رسالتك بنجاح!');
      }
      setFormData({ name: '', email: '', message: '', subject: '', isTestimonial: false, rating: 5 });
    } catch (error) {
      setError(error.response?.data?.error || 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="bg-[#F3E5F5] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#4A4A4A] sm:text-5xl md:text-6xl">
              تواصل معنا
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-[#757575] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              نحن هنا للإجابة على استفساراتك ومشاركة تجربتك!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
            <div className="bg-white shadow-xl rounded-lg p-6 w-full lg:w-2/3">
              {success && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-right">
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-right">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-right">الاسم</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                      placeholder="الاسم الكامل"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-right">البريد الإلكتروني</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                      placeholder="example@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 text-right">الموضوع</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                    placeholder="موضوع الرسالة"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 text-right">الرسالة</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>

                <div>
                  <label className="flex items-center space-x-2 justify-end">
                    <span className="text-sm font-medium text-gray-700">مشاركة كتقييم</span>
                    <input
                      type="checkbox"
                      name="isTestimonial"
                      checked={formData.isTestimonial}
                      onChange={handleChange}
                      className="rounded text-[#9C27B0] focus:ring-[#9C27B0] h-4 w-4 ml-2"
                    />
                  </label>
                </div>

                {formData.isTestimonial && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right mb-2">التقييم</label>
                    <div className="flex justify-end space-x-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <Star
                          key={star}
                          className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${
                            star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                          onClick={() => setFormData(prev => ({...prev, rating: star}))}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" className={buttonClasses}>
                  <span className="flex items-center justify-center">
                    <Send className="w-5 h-5 ml-2" />
                    {formData.isTestimonial ? 'إرسال التقييم' : 'إرسال الرسالة'}
                  </span>
                </button>
              </form>
            </div>

            <div className="w-full lg:w-1/3 space-y-8">
              <div className="bg-white shadow-xl rounded-lg p-6 space-y-6">
                <h2 className="text-2xl font-bold text-[#4A4A4A] text-right">معلومات التواصل</h2>
                <div className="flex items-center justify-end space-x-3 text-gray-700">
                  <span>+962 7 9999 9999</span>
                  <Phone className="w-5 h-5 text-[#9C27B0]" />
                </div>
                <div className="flex items-center justify-end space-x-3 text-gray-700">
                  <span>support@bazaar.com</span>
                  <Mail className="w-5 h-5 text-[#9C27B0]" />
                </div>
                <div className="flex items-start justify-end space-x-3 text-gray-700">
                  <span>عمان، الأردن</span>
                  <MapPin className="w-5 h-5 text-[#9C27B0] mt-1" />
                </div>
              </div>
              
              <img 
                className="w-full rounded-lg shadow-lg" 
                src="/images/contact.jpg" 
                alt="تواصل معنا" 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs; 