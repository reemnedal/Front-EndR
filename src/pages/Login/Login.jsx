import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/users/userThunk";
import loginImage from "./../../assets/images/login.jpg";

const primaryColor = "bg-primary hover:bg-primary-hover text-white";
const inputClasses =
  "border border-primary-light rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:ring-primary";
const labelClasses = "text-primary-light font-medium mb-1";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    dispatch(loginUser(formData));
  };

  return (
    <div className="flex h-screen bg-secondary-light">
      <div className="w-1/2 hidden md:flex">
        <img
          src={loginImage}
          alt="تسجيل الدخول"
          className="h-full w-full object-cover rounded-l-lg"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-primary-light mb-4 text-center">
            أهلاً بك في البازار المنزلي
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div className="mb-4">
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
            <div className="mb-4">
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
            <button
              type="submit"
              className={`w-full py-2 rounded-md ${primaryColor} transition-colors duration-300`}
            >
              {loading ? "جاري التحميل..." : "تسجيل الدخول"}
            </button>
          </form>
          <p className="mt-4 text-center">
            ليس لديك حساب؟{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-primary-hover font-semibold"
            >
              سجل هنا
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
