import axios from "axios";

const updateData = async (type, action, id, updatedData) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/${type}/${action}/${id}`,
      updatedData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Server error: ${
          error.response.data.message || error.response.statusText
        }`
      );
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

export default updateData;
