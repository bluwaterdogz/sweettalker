import axios from "axios";

export const authApi = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
});

export const chatGPTApi = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_CHAT_GPT_API_KEY}`,
  },
});

// if (logging === true) {
// chatGPTApi.interceptors.request.use((config) => {
//   console.log("➡️ Axios Request:", {
//     method: config.method,
//     url: config.url,
//     baseUrl: config.baseURL,

//     data: config.data,
//   });
//   return config;
// });
// authApi.interceptors.request.use((config) => {
//   console.log("➡️ Axios Request:", {
//     method: config.method,
//     url: config.url,
//     baseUrl: config.baseURL,

//     data: config.data,
//   });
//   return config;
// });
// }
