 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Upload, User, Mail, FileText, Package, ShoppingCart, Calendar, DollarSign } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/user";

export default function UserProfile() {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ 
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/userprofile`, {
          withCredentials: true,
        });
        const data = response.data;
        setUser(data);
        setFormData({
          username: data.username,
          email: data.email,
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders`, {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchProfile();
    fetchOrders();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (formData.bio.length > 500) {
      newErrors.bio = "Bio cannot exceed 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const response = await axios.put(`${API_BASE_URL}/userprofile`, formData, {
        withCredentials: true,
      });
      const updatedUser = response.data;
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderOrderStatus = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      ready: "bg-green-100 text-green-800",
      "on the way": "bg-purple-100 text-purple-800",
      delivered: "bg-green-200 text-green-900",
      cancelled: "bg-red-100 text-red-800"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen text-black mt-12 py-10 px-4">
      <div className="max-w-4xl mx-auto   backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex border-b border-black/20">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-4 text-center transition-all duration-300 ${
              activeTab === "profile" 
                ? 'bg-[#9C27B0]/20 text-[#9C27B0] border-b-2 border-[#9C27B0]'
                : 'hover:bg-[#9C27B0]/10 text-black/70 hover:text-[#9C27B0]'
            }`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-4 text-center transition-all duration-300 ${
              activeTab === "orders" 
                ? 'bg-[#9C27B0]/20 text-[#9C27B0] border-b-2 border-[#9C27B0]'
                : 'hover:bg-[#9C27B0]/10 text-black/70 hover:text-[#9C27B0]'
            }`}
          >
            My Orders
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="p-8 relative">
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-white bg-[#9C27B0] hover:bg-[#9C27B0]/90 px-4 py-2 rounded-full transition-all"
                >
                  Edit Profile
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-white bg-red-500 hover:bg-red-500/90 px-4 py-2 rounded-full transition-all"
                >
                  Cancel
                </button>
              )}
            </div>

            <h1 className="text-3xl font-bold text-black mb-6 text-center">User Profile</h1>
            
            <div className="flex flex-col items-center space-y-4 mb-8">
              <div className="relative group">
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-black/30 object-cover shadow-lg group-hover:opacity-75 transition-opacity"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center rounded-full bg-black/20 text-black">
                    <User size={48} />
                  </div>
                )}

                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer">
                      <Upload size={24} color="black" />
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              
              {!isEditing && (
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-black">{user.username}</h2>
                  <p className="text-black/70">{user.email}</p>
                </div>
              )}
            </div>

            {isEditing && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-black/80 mb-2">Username</label>
                  <input 
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-black/10 border border-black/20 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black/30"
                    placeholder="Enter your username"
                  />
                  {errors.username && <p className="text-red-300 text-sm mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-black/80 mb-2">Email</label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/10 border border-black/20 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black/30"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="bio" className="block text-black/80 mb-2">Bio</label>
                  <textarea 
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full bg-black/10 border border-black/20 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black/30"
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                  {errors.bio && <p className="text-red-300 text-sm mt-1">{errors.bio}</p>}
                </div>

                <div className="flex justify-center">
                  <button 
                    type="submit" 
                    className="bg-[#9C27B0] hover:bg-[#9C27B0]/90 text-white px-6 py-2 rounded-full transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-black mb-6">My Orders</h2>
            {orders.length === 0 ? (
              <p className="text-black/70 text-center">No orders found</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div 
                    key={order._id} 
                    className="bg-black/10 border border-black/20 rounded-lg shadow-sm p-6 hover:bg-black/20 transition-all"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <Package size={20} className="text-black" />
                        <h3 className="font-semibold text-black">Order #{order._id.slice(-6)}</h3>
                      </div>
                      {renderOrderStatus(order.driverStatus)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-black/80">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <ShoppingCart size={16} className="text-black/70" />
                          <span>Total Items: {order.items.length}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign size={16} className="text-black/70" />
                          <span>Total: ${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-black/70" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-black">Delivery Address</h4>
                        <p className="text-black/70">
                          {order.deliveryAddress.street}, 
                          {order.deliveryAddress.city}, 
                          {order.deliveryAddress.state} 
                          {order.deliveryAddress.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}