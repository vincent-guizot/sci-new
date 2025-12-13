import axios from "axios";

const API = axios.create({
  baseURL: "https://sci-mongo.onrender.com",
});

export default API;
