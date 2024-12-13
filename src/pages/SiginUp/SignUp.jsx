import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../Redux/users/userThunk";
import register from "./../../assets/images/login.jpg";

const primaryColor = "bg-primary hover:bg-primary-hover text-white";
const inputClasses =
  "border border-primary-light rounded-md px-4 py-2 w-full focus:outline-none";
const labelClasses = "text-primary-light font-medium mb-1";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="flex h-screen bg-secondary-light">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-primary-light mb-4">
            تسجيل حساب جديد
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div>
              <label htmlFor="username" className={labelClasses}>
                اسم المستخدم
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClasses}>
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelClasses}>
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 rounded-md ${primaryColor} transition-colors duration-300`}
            >
              {loading ? "جاري التحميل..." : "تسجيل"}
            </button>
          </form>
          <p className="mt-4 text-center">
            لديك حساب؟{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary-hover font-semibold"
            >
              سجل الدخول هنا
            </Link>
          </p>
        </div>
      </div>
      <div className="w-1/2 hidden md:block">
        <img
          src={register}
          alt="تسجيل"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default Register;
