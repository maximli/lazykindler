import axios from 'axios';
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:9527',
    timeout: 20000,
});
