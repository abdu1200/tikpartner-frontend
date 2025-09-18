import axios from "axios";

const backendUrl = axios.create({ 
  baseURL: 'https://tikbackend.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add auth token to requests
backendUrl.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



export default backendUrl;



// https://tikpartner.duckdns.org/backend/  for EC2..EC2's public ip address
// http://127.0.0.1:8000/ for localhost
// https://tikbackend.onrender.com/  for render
