import axios from "axios";

// Create an Axios instance with correct backend URL
const apiClient = axios.create({
  baseURL: "http://localhost:8081", // Correct backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include authorization token if available
apiClient.interceptors.request.use(
  (config) => {
    // Skip adding Bearer token for login requests
    if (config.url.includes("/auth/login")) {
      return config;
    }

    const token = sessionStorage.getItem("accessToken"); // Retrieve token from sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;