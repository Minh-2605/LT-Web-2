import axios from 'axios';

const API_URL = 'http://localhost:8367/categories'; // Gọi qua Gateway

export const categoryApi = {
    getAll: () => axios.get(API_URL),
    add: (data) => axios.post(API_URL, data),
    update: (id, data) => axios.put(`${API_URL}/${id}`, data),
    delete: (id) => axios.delete(`${API_URL}/${id}`),
};