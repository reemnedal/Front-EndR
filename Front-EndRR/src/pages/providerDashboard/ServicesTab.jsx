import React, { useState, useEffect } from "react";
import { Edit, Trash2, ImagePlus } from "lucide-react";
import axios from "axios";
import useFetchData from "./../../components/hooks/get";

const ServicesTab = () => {
  // Categories for dropdown
  const categories = ["ملابس", "طعام", "مصنوعات يدوية", "اكسسوارات"];
  const {
    data: serviceData,
    loading: serviceDataLoading,
    error: serviceDataError,
  } = useFetchData("products", "get");

  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    titleAr: "",
    description: "",
    price: "",
    mainImage: null,
    additionalImages: [],
    category: categories[0],
    details: "",
    handmade: false,
    size: "",
    materials: "",
  });

  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    if (serviceData && serviceData.products) {
      setServices(serviceData.products);
    }
  }, [serviceData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewService((prev) => ({
        ...prev,
        mainImage: file,
      }));
    }
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    if (files.length > 0) {
      setNewService((prev) => ({
        ...prev,
        additionalImages: files,
      }));
    }
  };

  const handleEdit = (service) => {
    // Reset form with existing service data
    setNewService({
      titleAr: service.titleAr,
      description: service.description,
      price: service.price,
      mainImage: null, // Preserve existing image URL
      additionalImages: [], // Preserve existing additional images
      category: service.category,
      details: service.details,
      handmade: service.handmade,
      size: service.size,
      materials: service.materials,
      existingMainImage: service.mainImage, // Store existing image URL
      existingAdditionalImages: service.additionalImages || [], // Store existing additional images
    });
    setEditingService(service);
  };

  const handleAddService = async () => {
    const formData = new FormData();
    formData.append("titleAr", newService.titleAr);
    formData.append("description", newService.description);
    formData.append("price", newService.price);
    formData.append("category", newService.category);
    formData.append("details", newService.details);
    formData.append("handmade", newService.handmade);
    formData.append("size", newService.size);
    formData.append("materials", newService.materials);

    // Handle main image
    if (newService.mainImage) {
      formData.append("mainImage", newService.mainImage);
    } else if (newService.existingMainImage) {
      // If no new image, keep the existing image URL
      formData.append("existingMainImage", newService.existingMainImage);
    }

    // Handle additional images
    if (newService.additionalImages && newService.additionalImages.length > 0) {
      newService.additionalImages.forEach((image) => {
        formData.append(`additionalImages`, image);
      });
    } else if (
      newService.existingAdditionalImages &&
      newService.existingAdditionalImages.length > 0
    ) {
      // If no new additional images, keep existing images
      newService.existingAdditionalImages.forEach((imageUrl) => {
        formData.append("existingAdditionalImages", imageUrl);
      });
    }

    try {
      if (editingService) {
        console.log(editingService);

        // Update existing service
        const response = await axios.put(
          `http://localhost:5000/api/products/update/${editingService._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        setServices(
          services.map((service) =>
            service.id === editingService.id ? response.data.product : service
          )
        );

        // Reset editing state
        setEditingService(null);
      } else {
        // Add new service
        const response = await axios.post(
          "http://localhost:5000/api/products/add",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        setServices([...services, response.data.product]);
      }

      // Reset form
      setNewService({
        titleAr: "",
        description: "",
        price: "",
        mainImage: null,
        additionalImages: [],
        category: categories[0],
        details: "",
        handmade: false,
        size: "",
        materials: "",
      });
    } catch (error) {
      console.error("فشل إضافة/تعديل الخدمة:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      // Make the DELETE request to the server
      await axios.delete(`http://localhost:5000/api/products/delete/${id}`, {
        withCredentials: true,
      });

      // If deletion is successful, remove the service from the local state
      setServices(services.filter((service) => service.id !== id));
    } catch (error) {
      console.error("فشل حذف الخدمة:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary-light rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary">
          {editingService ? "تعديل الخدمة" : "إضافة خدمة"}
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            name="titleAr"
            value={newService.titleAr}
            onChange={handleInputChange}
            placeholder="اسم الخدمة"
            className="w-full p-2 border rounded-md"
          />

          <select
            name="category"
            value={newService.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            value={newService.price}
            onChange={handleInputChange}
            placeholder="السعر"
            className="w-full p-2 border rounded-md"
          />

          <textarea
            name="description"
            value={newService.description}
            onChange={handleInputChange}
            placeholder="وصف الخدمة"
            className="w-full p-2 border rounded-md h-24"
          />

          <textarea
            name="details"
            value={newService.details}
            onChange={handleInputChange}
            placeholder="تفاصيل إضافية"
            className="w-full p-2 border rounded-md h-24"
          />

          <input
            type="text"
            name="size"
            value={newService.size}
            onChange={handleInputChange}
            placeholder="الحجم (رقم أو نص حتى 10 أحرف)"
            className="w-full p-2 border rounded-md"
          />

          <input
            type="text"
            name="materials"
            value={newService.materials}
            onChange={handleInputChange}
            placeholder="المواد المستخدمة (12 حرف على الأقل)"
            className="w-full p-2 border rounded-md"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              name="handmade"
              checked={newService.handmade}
              onChange={handleInputChange}
              className="ml-2"
            />
            <label>هل المنتج مصنوع يدويًا؟</label>
          </div>

          <div className="flex justify-between">
            <div>
              <input
                type="file"
                id="main-image"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
              />
              <label
                htmlFor="main-image"
                className="flex items-center cursor-pointer bg-primary text-white p-2 rounded-md"
              >
                <ImagePlus className="ml-2" /> رفع الصورة الرئيسية
              </label>
              {newService.mainImage ? (
                <img
                  src={URL.createObjectURL(newService.mainImage)}
                  alt="الصورة الرئيسية"
                  className="w-20 h-20 object-cover rounded-md mt-2"
                />
              ) : (
                newService.existingMainImage && (
                  <img
                    src={newService.existingMainImage}
                    alt="الصورة الرئيسية"
                    className="w-20 h-20 object-cover rounded-md mt-2"
                  />
                )
              )}
            </div>

            <div>
              <input
                type="file"
                id="additional-images"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesUpload}
                className="hidden"
              />
              <label
                htmlFor="additional-images"
                className="flex items-center cursor-pointer bg-secondary text-primary p-2 rounded-md"
              >
                <ImagePlus className="ml-2" /> رفع الصور الإضافية (0-3)
              </label>
              <div className="flex space-x-2 mt-2">
                {newService.additionalImages.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`صورة إضافية ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
                {newService.additionalImages.length === 0 &&
                  newService.existingAdditionalImages &&
                  newService.existingAdditionalImages.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`صورة إضافية ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddService}
            className="w-full bg-primary text-white p-2 rounded-md mt-4"
          >
            {editingService ? "تحديث الخدمة" : "إضافة الخدمة"}
          </button>
        </div>
      </div>

      <div className="bg-secondary-light rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary">الخدمات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-4">
              <div>
                {service.mainImage && (
                  <img
                    src={service.mainImage}
                    alt="الصورة الرئيسية"
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                )}

                {service.additionalImages &&
                  service.additionalImages.length > 0 && (
                    <div className="flex space-x-2 mb-4">
                      {service.additionalImages.map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={img}
                          alt={`صورة إضافية ${imgIndex + 1}`}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg text-primary">
                      {service.titleAr}
                    </p>
                    <p className="text-text-secondary">{service.category}</p>
                    <p className="text-text-secondary">{service.price} JD</p>
                    <p className="text-text-secondary">الحجم: {service.size}</p>
                    <p className="text-text-secondary">
                      المواد: {service.materials}
                    </p>
                    <p className="text-text-secondary">
                      صناعة يدوية: {service.handmade ? "نعم" : "لا"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-text-secondary mt-2">
                  {service.description}
                </p>
                <p className="text-text-primary text-sm mt-1">
                  {service.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesTab;
