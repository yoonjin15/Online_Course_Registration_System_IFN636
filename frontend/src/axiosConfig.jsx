import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  //baseURL: 'http://3.25.213.35:5001', // live
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
