import axiosClient from './axiosClient';

export const userApi = {
    // 1. Các API dành cho Admin (Quản lý)
    getAll: () => axiosClient.get('/users'),
    getById: (id) => axiosClient.get(`/users/${id}`),

    // 2. Các API dành cho xác thực (Login/Register)
    // Gọi đến RegisterController (@PostMapping("/registration"))
    register: (data) => axiosClient.post('/registration', data),

    // Nếu sau này Minh làm Login, Minh thêm vào đây luôn
    login: (credentials) => axiosClient.post('/login', credentials),

    // API Cập nhật thông tin chi tiết
    updateDetails: (id, details) => axiosClient.put(`/users/${id}/details`, details),

    // API Quên mật khẩu
    forgotPassword: (email) => axiosClient.post(`/forgot-password`, null, { params: { email } }),
    resetPassword: (email, otp, newPassword) => axiosClient.post(`/reset-password`, null, { params: { email, otp, newPassword } }),
};