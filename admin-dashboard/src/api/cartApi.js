import axiosClient from './axiosClient';

const getCartId = () => {
    // Lấy thông tin user đã đăng nhập từ localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user && user.id) {
                return user.id.toString();
            }
        } catch (e) {
            console.error('Lỗi parse thông tin user', e);
        }
    }
    
    // Fallback: nếu chưa đăng nhập, tạm thời dùng random ID hoặc có thể ném lỗi
    let cartId = localStorage.getItem('guestCartId');
    if (!cartId) {
        cartId = 'guest_' + Math.floor(Math.random() * 1000000000).toString(); 
        localStorage.setItem('guestCartId', cartId);
    }
    return cartId;
};

export const cartApi = {
    getCart: () => 
        axiosClient.get('/cart', { headers: { 'cartId': getCartId() } }),
    
    addItem: (productId, quantity) => 
        axiosClient.post(`/cart?productId=${productId}&quantity=${quantity}`, null, { headers: { 'cartId': getCartId() } }),
    
    removeItem: (productId) => 
        axiosClient.delete(`/cart?productId=${productId}`, { headers: { 'cartId': getCartId() } }),
};
