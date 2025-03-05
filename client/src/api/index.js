// src/api/index.js
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

// Add these new functions
export const getProfile = async (token) =>
  await API.get("/user/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = async (token, data) =>
  await API.put("/user/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });