import axiosClient from './axiosClient';

export const paymentApi = {
    // 1. DÀNH CHO ADMIN
    getAllPayments: () => axiosClient.get('/payments/admin'),

    // 2. DÀNH CHO KHÁCH HÀNG
    createVNPayUrl: (amount, orderInfo) => 
        axiosClient.get(`/payments/vnpay/create-payment`, {
            params: { amount, orderInfo }
        }),

    // Lưu thông tin thanh toán vào Database
    savePayment: (paymentData) => axiosClient.post('/payments', paymentData)
};
