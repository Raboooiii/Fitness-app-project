import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/",
});

export const UserSignUp = async (data) => {
  try {
    const response = await API.post("/user/signup", data);
    return response;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

export const UserSignIn = async (data) => {
  try {
    const response = await API.post("/user/signin", data);
    return response;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

export const getDashboardDetails = async (token) =>
  API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorkouts = async (token, date) =>
  await API.get(`/user/workout${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addWorkout = async (token, data) =>
  await API.post(`/user/workout`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getProfile = async (token) =>
  await API.get("/user/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = async (token, data) =>
  await API.put("/user/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Add this new function to fetch fitness data
export const getFitnessData = async (token) =>
  await API.get("/user/fitness-data", {
    params: { token }, // Pass the access token as a query parameter
  });

  export const uploadStepData = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await API.post("/upload-steps", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("fittrack-app-token")}`,
        },
      });
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };
  
  export const getStepData = async () => {
    try {
      const response = await API.get("/step-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("fittrack-app-token")}`,
        },
      });
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };
  
// Add these new functions
export const getRunningData = async (token) =>
  await API.get("/running/data", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const saveRunningData = async (token, data) =>
  await API.post("/running/data", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWeeklyAnalysis = async (token) =>
  await API.get("/running/weekly", {
    headers: { Authorization: `Bearer ${token}` },
  });
