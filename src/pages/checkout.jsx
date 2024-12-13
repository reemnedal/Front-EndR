import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AlertCircle, CreditCard, DollarSign, ShoppingCart, MapPin, Mail, Phone, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe('pk_test_51Pq8qdRr1S70aw7OTJtAwrka7pZ46PKd5fh71Lv7SwXg6EB0hYB7Duydyj3S2Lrr0wUcai5nqSiTpBXx4LmS6NaJ00c7gAz0nh');

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/cart', {
        withCredentials: true
      });
      setCartItems(response.data.items);
      setTotal(response.data.total);

    } catch (error) {
      setError('Failed to fetch cart items');
      console.error('Error fetching cart:', error);
    }
  };

  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      setError(null);

      const orderData = {
        items: cartItems,
        total,
        paymentMethod,
        ...deliveryInfo
      };

      try {
        if (paymentMethod === 'stripe') {
          const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
          });

          if (error) {
            setError(error.message);
            setLoading(false);
            return;
          }

          await axios.post('http://localhost:5000/api/user/create', {
            ...orderData,
            stripePaymentMethodId: paymentMethod.id
          }, { withCredentials: true });
        } else {
          await axios.post('http://localhost:5000/api/user/create', orderData, {
            withCredentials: true
          });
        }
        navigate("/"); 
        // Handle successful order (e.g., redirect, show success message)
      } catch (error) {
        setError('Order creation failed');
        console.error('Order creation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <h1 className="text-3xl font-bold flex items-center">
            <ShoppingCart className="mr-3" /> Checkout
          </h1>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
            <AlertCircle className="inline-block mr-2" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-purple-600 flex items-center">
                <User className="mr-2" /> Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={deliveryInfo.firstName}
                    onChange={handleDeliveryInfoChange}
                    placeholder="First Name"
                    required
                    className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
                  />
                  <User className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={deliveryInfo.lastName}
                    onChange={handleDeliveryInfoChange}
                    placeholder="Last Name"
                    required
                    className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
                  />
                  <User className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="relative mt-4">
                <input
                  type="email"
                  name="email"
                  value={deliveryInfo.email}
                  onChange={handleDeliveryInfoChange}
                  placeholder="Email"
                  required
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
                />
                <Mail className="absolute left-3 top-3 text-gray-400" />
              </div>

              <div className="relative mt-4">
                <input
                  type="tel"
                  name="phone"
                  value={deliveryInfo.phone}
                  onChange={handleDeliveryInfoChange}
                  placeholder="Phone Number"
                  required
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
                />
                <Phone className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Delivery Information Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-purple-600 flex items-center">
                <MapPin className="mr-2" /> Delivery Address
              </h2>
              <div className="relative mb-4">
                <input
                  type="text"
                  name="street"
                  value={deliveryInfo.street}
                  onChange={handleDeliveryInfoChange}
                  placeholder="Street Address"
                  required
                  className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
                />
                <MapPin className="absolute left-3 top-3 text-gray-400" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    value={deliveryInfo.city}
                    onChange={handleDeliveryInfoChange}
                    placeholder="City"
                    required
                    className="w-full pl-3 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="state"
                    value={deliveryInfo.state}
                    onChange={handleDeliveryInfoChange}
                    placeholder="State"
                    required
                    className="w-full pl-3 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="zipCode"
                    value={deliveryInfo.zipCode}
                    onChange={handleDeliveryInfoChange}
                    placeholder="Zip Code"
                    required
                    className="w-full pl-3 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-600 flex items-center">
              <DollarSign className="mr-2" /> Payment Method
            </h2>
            <div className="flex space-x-6 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="mr-2 hidden peer"
                  id="cash-payment"
                />
                <div className="p-3 border-2 rounded-lg peer-checked:border-purple-500 peer-checked:text-purple-600 transition">
                  Cash Payment
                </div>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className="mr-2 hidden peer"
                  id="credit-card"
                />
                <div className="p-3 border-2 rounded-lg peer-checked:border-purple-500 peer-checked:text-purple-600 transition">
                  Credit Card
                </div>
              </label>
            </div>

            {paymentMethod === 'stripe' && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                  className="border p-3 rounded" 
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
              <ShoppingCart className="mr-2" /> Order Summary
            </h2>
            {cartItems.map(item => (
              <div key={item.product._id} className="flex justify-between mb-2">
                <span>{item.product.titleAr}</span>
                <span>{item.price * item.quantity} دينار</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 text-xl font-bold text-purple-700">
              Total: {total} دينار
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 flex items-center justify-center ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            {loading ? 'Processing...' : 'Complete Order'}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default CheckoutPage;