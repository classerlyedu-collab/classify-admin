import axios from "axios";

import endPoints from "../constant/apiEndpoint";

// setup base thing
const apiRequest = axios.create({
  baseURL: endPoints.BASE_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

apiRequest.interceptors.response.use(
  (response) => {
    console.log(response);

    if (response.status === 200 || response.status === 201) {
      if (response?.data?.success) {
        return Promise.resolve(response?.data);
      } else {
        console.log(response);
        // toast.error(response.data.message);
        return Promise.reject(response?.data?.message);
      }
    }
  },
  (error) => {
    if (error.response) {
      // Handle specific response errors here
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("userData");
        }
      }
      return Promise.reject(error.response); // return the response for further handling
    } else {
      // Handle errors without a response, like network errors
      console.error("Network or server error:", error.message);
      return Promise.reject(error);
    }
  }
);


export default apiRequest;
