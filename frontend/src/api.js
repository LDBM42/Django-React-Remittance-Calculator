//Intercepters intercept any request we are gonna send 
// and automaticaly add the correct header
import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/djangoreactremittancecalc/backend/rest-api-be2/v1.0";

const api = axios.create({
    // this imports anything that is inside an emvironment variable
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            // this is how we pass a jwt token
            //`` is like the f"" in python, so we can add variables
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);       
    }
);

export default api;