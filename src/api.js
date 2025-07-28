import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY; // API key

const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        "x-api-key": API_KEY,
    },
});

export default API;
