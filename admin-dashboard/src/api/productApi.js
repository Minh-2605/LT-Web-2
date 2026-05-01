// src/api/productApi.js
import axiosClient from './axiosClient';

export const productApi = {
    // Lấy danh sách (thường nằm ở ProductController)
    getAll: () => axiosClient.get('/api/products'),

    // Lấy chi tiết sản phẩm cho trang Customer
    getById: (id) => axiosClient.get(`/api/products/${id}`),

    // Thêm sản phẩm (khớp với AdminProductController)
    add: (product) => axiosClient.post('/admin/products', product),

    // Xóa sản phẩm (khớp với AdminProductController)
    delete: (id) => axiosClient.delete(`/admin/products/${id}`),

    // Sửa sản phẩm (Sẽ bổ sung khi có code Backend của bạn)
    update: (id, product) => axiosClient.put(`/admin/products/${id}`, product),
};