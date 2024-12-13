import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUser } from "../../redux/users/userThunk";
import { useDispatch, useSelector } from "react-redux";
import { useAuthActions } from "./../../components/hooks/logout";
import defaultImage from "./../../assets/images/user.png";

const NavigationBar = () => {
  const { handleLogout } = useAuthActions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    user,
    loading: userLoading,
    error: userError,
    isAuthenticated,
  } = useSelector((state) => state.user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // const handleProfileNavigation = () => {
  //   // Check if user exists and is authenticated before navigation
  //   if (isAuthenticated && user) {
  //     // Navigate based on user role, with a default fallback
  //     switch (user.role) {
  //       case "user":
  //         navigate("/profile");
  //         break;
  //       case "provider":
  //         navigate("/providerDashboard");
  //         break;
  //       default:
  //         navigate("/profile"); // Default fallback route
  //     }
  //   } else {
  //     // If not authenticated, redirect to login
  //     navigate("/login");
  //   }
  // };
  const handleProfileNavigation = () => {
    // Check the user's role and navigate accordingly
    if (user.role === "user") {
      navigate("/userprofile");
    } else if (user.role === "provider") {
      navigate("/providerDashboard");
    }
  };
  return (
    <nav className="bg-[#CB9DF0] py-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center text-white font-bold text-xl">
          <svg
            className="w-10 h-10 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="currentColor"
            />
            <path
              d="M12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 6 12 6ZM12 10C11.45 10 11 9.55 11 9C11 8.45 11.45 8 12 8C12.55 8 13 8.45 13 9C13 9.55 12.55 10 12 10Z"
              fill="currentColor"
            />
          </svg>
          بازار المبدعات
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          {/* Navigation Links */}
          <div className="flex items-center space-x-4 xl:space-x-6">
            <Link
              to="/"
              className="hover:text-[#F0C1E1] transition-colors duration-300"
            >
              الرئيسية
            </Link>
            <Link
              to="/products"
              className="hover:text-[#F0C1E1] transition-colors duration-300"
            >
              المنتجات
            </Link>

            <Link
              to="/cart"
              className="hover:text-[#F0C1E1] transition-colors duration-300"
            >
              سلة المنتجات
            </Link>
            <Link
              to="/contact"
              className="hover:text-[#F0C1E1] transition-colors duration-300"
            >
              تواصل معنا وقيمنا
            </Link>
            <Link
              to="/driver-application"
              className="hover:text-[#F0C1E1] transition-colors duration-300"
            >
              انضم كسائق
            </Link>
          </div>

          {/* Authentication Section */}
          <div className="mr-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={toggleProfileDropdown}
                  className="flex items-center cursor-pointer bg-[#8B4093] px-3 py-2 rounded-md hover:bg-[#A050A8] transition-colors duration-300"
                >
                  <img
                    src={user.Picture || "/default-avatar.png"}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                  <span className="text-white mr-2 text-lg">
                    {user.username}
                  </span>
                  <svg
                    className="w-5 h-5 mr-2 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isProfileDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-full min-w-[200px] bg-white rounded-md shadow-lg z-50">
                    <button
                      onClick={handleProfileNavigation}
                      className="block w-full text-right px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-md"
                    >
                      الملف الشخصي
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-right px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-md"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#8B4093] px-4 py-2 rounded-md hover:bg-[#A050A8] transition-colors duration-300"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M4 12H20M4 18H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#CB9DF0] py-4 shadow-md">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col space-y-4">
            <Link
              to="/"
              className="hover:text-[#F0C1E1] transition-colors duration-300"
            >
              الرئيسية
            </Link>
            <Link
              to="/products"
              className="hover:text-[#F0C1E1] transition-colors duration-300"
            >
              المنتجات
            </Link>
            <button
              onClick={handleProfileNavigation}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-md"
            >
              الملف الشخصي
            </button>
            <Link
              to="/about"
              className="hover:text-[#F0C1E1] transition-colors duration-300"
            >
              من نحن
            </Link>
            <Link
              to="/contact"
              className="hover:text-[#F0C1E1] transition-colors duration-300"
            >
              تواصل معنا وقيمنا
            </Link>
            <Link
              to="/driver-application"
              className="hover:text-[#F0C1E1] transition-colors duration-300"
            >
              انضم كسائق
            </Link>

            {/* Mobile Authentication Section */}
            {isAuthenticated && user ? (
              <div>
                <div className="flex items-center mb-4">
                  <img
                    src={user.Picture || "/default-avatar.png"}
                    alt="User Profile"
                    className="w-12 h-12 rounded-full ml-3 object-cover"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <span className="text-white text-lg">{user.username}</span>
                </div>
                <button
                  onClick={handleProfileNavigation}
                  className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-md"
                >
                  الملف الشخصي
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full bg-[#8B4093] px-4 py-2 rounded-md hover:bg-[#A050A8] transition-colors duration-300"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#8B4093] px-4 py-2 rounded-md hover:bg-[#A050A8] transition-colors duration-300"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
