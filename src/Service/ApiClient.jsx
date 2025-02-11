import axios from "axios";

const instance = axios.create({
  //baseURL: "https://aaklan.c4k.in/cbicApi",  
 baseURL: "http://localhost:8080/cbicApi",
 headers:{
  'Content-Type':'application/json',
  'Accept':'application/json',
 },
});

instance.interceptors.request.use(
  function (config) {
    const userId = "CBIC";
    const password = "Cbic@2024@";

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
      localStorage.clear();
      window.location.reload("/");
    }
    return Promise.reject(error);
  }
);

export default instance;
