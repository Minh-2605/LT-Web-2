import axiosClient from './axiosClient';

export const orderApi = {
    // --- DÀNH CHO ADMIN ---

    // Lấy danh sách tất cả đơn hàng
    getAllOrders: () => axiosClient.get('/admin/orders'),

    // Cập nhật trạng thái đơn hàng (Sử dụng PatchMapping như Controller đã viết)
    // Truyền status qua params vì Backend dùng @RequestParam
    updateStatus: (id, status) =>
        axiosClient.patch(`/admin/orders/${id}`, null, {
            params: { status }
        }),

    // --- DÀNH CHO KHÁCH HÀNG (USER) ---

    // Đặt hàng (Lưu đơn hàng từ các sản phẩm được chọn trong giỏ hàng)
    // Gửi itemIds trong body và cartId trong headers
    saveOrder: (userId, itemIds) => {
        let cartId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id.toString() : localStorage.getItem('guestCartId');
        return axiosClient.post(`/order/${userId}`, itemIds, {
            headers: { 'cartId': cartId }
        });
    },

    // Lấy danh sách đơn hàng của người dùng
    getUserOrders: (userId) => axiosClient.get(`/order/user/${userId}`)
};