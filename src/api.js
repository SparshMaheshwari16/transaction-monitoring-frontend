import axios from "axios";

const API_KEY = "ab5a5840-7eca-4d14-8e74-7eb9d346feb1"; // Replace with your actual API key

const API = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "x-api-key": API_KEY,
    },
});

export default API;
