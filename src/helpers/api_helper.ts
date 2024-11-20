import axios from "axios";
import getErrorMessage from "./getErrorMessage";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Content type untuk POST
api.defaults.headers.post["Content-Type"] = "application/json";

/**
 * Interceptors Add Request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// Interceptor untuk handle response dan error
api.interceptors.response.use(
  (response) => {
    return response.data ? response.data : response;
  },
  (error) => {
    console.log("API Error:", error);

    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (error.response.status === 403) {
        toast.error("You do not have permission to access this resource.");
        return Promise.reject(error);
      }
    }

    const message = getErrorMessage(error);
    return Promise.reject(message);
  }
);

/**
 * Sets the default authorization
 * @param {string} token
 */
const setAuthorization = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

class APIClient {
  /**
   * Fetches data from given url
   */
  get = (url: string, params?: Record<string, any>) => {
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      return api.get(`${url}?${queryString}`);
    } else {
      return api.get(url);
    }
  };

  /**
   * Posts given data to url
   */
  create = (url: string, data: any) => api.post(url, data);

  /**
   * Updates data
   */
  update = (url: string, data: any) => api.patch(url, data);

  put = (url: string, data: any) => api.put(url, data);

  /**
   * Delete
   */
  delete = (url: string, config?: any) => api.delete(url, { ...config });
}

/**
 * Get logged user data from localStorage
 */
const getLoggedUser = () => {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

export { APIClient, setAuthorization, getLoggedUser };
