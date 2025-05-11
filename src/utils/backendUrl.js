import axios from "axios";

const backendUrl = axios.create({ 
  baseURL: 'http://127.0.0.1:8000/',
});

export default backendUrl;

// http://127.0.0.1:8000/ for localhost
// https://tikbackend.onrender.com/  for render
