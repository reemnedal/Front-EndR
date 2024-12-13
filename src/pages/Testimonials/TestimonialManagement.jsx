// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Star, ToggleLeft, ToggleRight } from 'lucide-react';

// const TestimonialManagement = () => {
//   const [testimonials, setTestimonials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const fetchTestimonials = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/testimonials/all');
//       setTestimonials(response.data);
//       setLoading(false);
//     } catch (error) {
//       setError('فشل في جلب التقييمات');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTestimonials();
//   }, []);

//   const handleToggleStatus = async (id) => {
//     try {
//       await axios.put(`http://localhost:5000/api/testimonials/toggle-status/${id}`);
//       fetchTestimonials();
//     } catch (error) {
//       setError('فشل في تغيير حالة التقييم');
//     }
//   };

//   if (loading) return <div className="text-center p-4">جاري التحميل...</div>;
//   if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

//   return (
//     <div className="p-6 bg-[#F3E5F5]">
//       <h2 className="text-2xl font-bold mb-6 text-[#4A4A4A]">إدارة التقييمات</h2>
//       <div className="grid gap-6">
//         {testimonials.map((testimonial) => (
//           <div 
//             key={testimonial._id} 
//             className={`bg-white p-6 rounded-lg shadow-md ${
//               !testimonial.isActive ? 'opacity-60' : ''
//             }`}
//           >
//             {/* Rest of the component with Arabic text */}
//             {/* ... */}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TestimonialManagement; 