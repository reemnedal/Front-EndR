import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const user = state.user;

    if (user && user.loggedIn) {
      console.log("User already authenticated, skipping fetch");
      return user;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/user/get", {
        withCredentials: true,
      });

      if (!response.data.loggedIn) {
        console.log("User not authenticated, rejecting");
        return rejectWithValue("User is not authenticated");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching user"
      );
    }
  }
);
// -------------------------updateUser--------------------------------------------
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/update",
        updatedData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating user"
      );
    }
  }
);
// -------------------------updateProfilePicture--------------------------------------------
export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("Updating profile picture...");
      console.log("FormData contents:", formData.get("image"));
      const response = await axios.put(
        "http://localhost:5000/api/user/update/image",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      
      console.log("Profile picture update response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating profile picture:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Error updating profile picture"
      );
    }
  }
);
// ---------------------------------------------------------------------

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login/user",
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error logging in"
      );
    }
  }
);
// ---------------------------------------------------------------------

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register/user",
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);
