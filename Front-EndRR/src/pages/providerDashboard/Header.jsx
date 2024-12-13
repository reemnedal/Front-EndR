import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit, X } from "lucide-react";
import { updateUser, updateProfilePicture } from "../../redux/users/userThunk";
import { useDispatch, useSelector } from "react-redux";
import defaultImage from "./../../assets/images/user.png";

// Custom Input Component
const Input = ({ type = "text", className = "", ...props }) => (
  <input
    type={type}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    {...props}
  />
);

// Custom Button Component
const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const variantStyles = {
    primary: "bg-purple-600 text-white hover:bg-purple-700",
    secondary: "bg-white text-purple-600 hover:bg-purple-100",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg transition duration-300 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Dialog Component
const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

const TherapistHeader = ({ user, onUpdateProfile }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: user?.username || "",
    aboutMe: user?.aboutMe || "",
  });
  const [profilePicture, setProfilePicture] = useState(user?.Picture);
  const [currentImageUrl, setCurrentImageUrl] = useState(
    user?.Picture ? user.Picture : defaultImage
  );

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setCurrentImageUrl(tempUrl);

      const formData = new FormData();
      formData.append("image", file);

      dispatch(updateProfilePicture(formData))
        .unwrap()
        .then((response) => {
          setCurrentImageUrl(response.newImagePath);
          URL.revokeObjectURL(tempUrl);
        })
        .catch((error) => {
          console.error("Error updating profile picture:", error);
          setCurrentImageUrl(user?.Picture ? user.Picture : defaultImage);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // إرسال البيانات إلى الخادم عبر Redux Thunk
    dispatch(updateUser(editedUser))
      .unwrap()
      .then(() => {
        // عند نجاح التحديث
        setIsEditModalOpen(false);
        console.log("Profile updated successfully!");
      })
      .catch((error) => {
        // عند حدوث خطأ
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="relative bg-gradient-to-r from-[#9C27B0] to-[#9C27B0] text-[#EEF6F9] rounded-2xl shadow-2xl overflow-hidden p-6">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
        {/* Profile Picture Section */}
        <div className="relative group">
          <img
            src={profilePicture}
            alt="Therapist Avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
          <label
            htmlFor="profile-picture-upload"
            className="absolute -bottom-1 -right-1 flex items-center justify-center cursor-pointer"
          >
            <input
              type="file"
              id="profile-picture-upload"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
            <Camera className="w-10 h-10 text-white bg-[#9C27B0] rounded-full p-2 shadow-md" />
          </label>
        </div>

        {/* User Details Section */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h1 className="text-3xl font-bold">{user?.username}</h1>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-[#EEF6F9] hover:text-purple-200 transition"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>

          <p className="text-lg text-purple-100 mt-2">{user?.email}</p>
          <p className="text-md text-purple-200 mt-1">{user?.aboutMe}</p>
        </div>

        {/* Navigation Button */}
        {/* <div>
          <Button
            variant="secondary"
            onClick={() => navigate("/")}
            className="bg-[#EEF6F9] text-[#9C27B0] hover:bg-[#f3adff] hover:text-[#EEF6F9]"
          >
            Profile
          </Button>
        </div> */}

        {/* Edit Profile Dialog */}
        <Dialog
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Edit Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-gray-700">Username</label>
              <Input
                name="username"
                value={editedUser.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                className="h-24 text-black"
              />

              <Input
                name="aboutMe"
                value={editedUser.aboutMe}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                className="h-24 text-black"
              />
            </div>
            <Button
              onClick={handleSaveChanges}
              className="w-full bg-[#9C27B0] hover:bg-purple-700"
            >
              Save Changes
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default TherapistHeader;
