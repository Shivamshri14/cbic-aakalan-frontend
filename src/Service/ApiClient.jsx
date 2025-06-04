import axios from "axios";

const instance = axios.create({
  //baseURL: "https://aaklan.c4k.in/cbicApi",  
  //baseURL: "https://DDVUAKAP01.cbic.gov.in:8080/cbicApi",
  baseURL: "http://localhost:8080/cbicApi",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

instance.interceptors.request.use(
  function (config) {
    const userId = process.env.REACT_APP_API_USERNAME;
    const password = process.env.REACT_APP_API_PASSWORD;

    if (userId && password) {
      // Base64 encode the user ID and password
      const encodedCredentials = btoa(`${userId}:${password}`);
      // Include Basic authentication header
      config.headers["Authorization"] = `Basic ${encodedCredentials}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      // localStorage.clear();
      window.location.reload("/");
    }
    return Promise.reject(error);
  }
);

export default instance;
