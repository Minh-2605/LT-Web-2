import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8367', // Cổng của Gateway Minh vừa cấu hình
  timeout: 15000,
});

export default axiosClient;