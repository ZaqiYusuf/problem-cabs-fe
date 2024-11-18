import axios from "axios";
import getErrorMessage from "./getErrorMessage";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Content type
api.defaults.headers.post["Content-Type"] = "application/json";

// Set authorization token if available
const token = localStorage.getItem("accessToken");
if (token){
  api.defaults.headers.common["Authorization"] = "Bearer " + token;

} else{
  api.defaults.headers.common["Authorization"] = "";
}

// Interceptor to handle responses and errors
api.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    console.log("api", error);
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("authUser");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (error.response.status === 403) {
        // Show toast notification on 403 Forbidden
        toast.error("You do not have permission to access this resource.");
        return Promise.reject(error);
      }
    }

    let message = getErrorMessage(error);
    return Promise.reject(message);
  }
);

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: any) => {
  api.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */
  get = (url: any, params: any) => {
    let response;

    let paramKeys: any = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = api.get(`${url}?${queryString}`, params);
    } else {
      response = api.get(`${url}`, params);
    }

    return response;
  };

  /**
   * Posts given data to url
   */
  create = (url: any, data: any) => {
    return api.post(url, data);
  };

  /**
   * Updates data
   */
  update = (url: any, data: any) => {
    return api.patch(url, data);
  };

  put = (url: any, data: any) => {
    return api.put(url, data);
  };

  /**
   * Delete
   */
  delete = (url: any, config: any) => {
    return api.delete(url, { ...config });
  };
}

const getLoggedUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedUser };
