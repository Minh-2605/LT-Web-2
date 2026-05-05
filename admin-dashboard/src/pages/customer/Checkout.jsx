import { useEffect, useState } from 'react';
import { Typography, Button, message, Spin, Divider, Radio, Tag } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, PhoneOutlined, MailOutlined, EditOutlined, CheckCircleFilled, CreditCardOutlined, CarOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import { orderApi } from '../../api/orderApi';
import { paymentApi } from '../../api/paymentApi';

const { Title, Text } = Typography;

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const selectedItems = location.state?.selectedItems || [];
    const subTotal = selectedItems.reduce((sum, item) => sum + (item.subTotal || 0), 0);
    const shippingFee = 0;
    const grandTotal = subTotal + shippingFee;

    useEffect(() => {
        if (selectedItems.length === 0) { message.warning("Không có sản phẩm nào!"); navigate('/cart'); return; }
        const fetchUser = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) { message.error("Vui lòng đăng nhập!"); navigate('/login'); return; }
                const currentUser = JSON.parse(userStr);
                const res = await userApi.getById(currentUser.id);
                if (res.data?.userDetails) {
                    setUserDetails(res.data.userDetails);
                } else {
                    message.warning("Vui lòng cập nhật địa chỉ giao hàng!");
                    navigate('/profile');
                }
            } catch { message.error("Không thể tải thông tin người dùng!"); }
            finally { setLoading(false); }
        };
        fetchUser();
    }, [navigate, selectedItems.length]);

    const handleConfirmOrder = async () => {
        setSubmitting(true);
        try {
            const userStr = localStorage.getItem('user');
            const currentUser = JSON.parse(userStr);
            const itemIds = selectedItems.map(item => item.id || item.productId);
            const res = await orderApi.saveOrder(currentUser.id, itemIds);
            const savedOrder = res.data;
            window.dispatchEvent(new Event('cartUpdated'));

            if (paymentMethod === 'vnpay') {
                const vnpayRes = await paymentApi.createVNPayUrl(grandTotal, `Thanh toan don hang ${savedOrder.id}`);
                if (vnpayRes.data?.data) {
                    message.loading("Đang chuyển sang VNPAY...", 2);
                    window.location.href = vnpayRes.data.data;
                } else {
                    message.error("Không thể tạo link thanh toán VNPAY");
                }
            } else {
                await paymentApi.savePayment({ orderId: savedOrder.id, amount: grandTotal, paymentMethod: 'COD', status: 'PENDING' });
                message.success("Đặt hàng thành công!");
                navigate('/orders');
            }
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi đặt hàng!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>;

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <Title level={2} style={{ margin: 0, fontWeight: 900, color: '#1a1a2e' }}>💳 Thanh Toán Đơn Hàng</Title>
                <Text style={{ color: '#6b7280' }}>Kiểm tra thông tin và xác nhận đơn hàng của bạn</Text>
            </div>

            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                {/* Cột trái */}
                <div style={{ flex: '1 1 0' }}>
                    {/* Thông tin giao hàng */}
                    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f0fe', overflow: 'hidden', marginBottom: 20 }}>
                        <div style={{ padding: '16px 24px', background: 'linear-gradient(135deg, #f0f7ff, #e8f0fe)', borderBottom: '1px solid #d0e4ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <HomeOutlined style={{ color: '#1677ff', fontSize: 18 }} />
                                <Text strong style={{ fontSize: 16, color: '#1a1a2e' }}>Thông tin giao hàng</Text>
                            </div>
                            <Button type="link" icon={<EditOutlined />} onClick={() => navigate('/profile')} style={{ color: '#1677ff', fontWeight: 600, padding: 0 }}>
                                Chỉnh sửa
                            </Button>
                        </div>
                        <div style={{ padding: '20px 24px' }}>
                            {userDetails ? (
                                <>
                                    <Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12, color: '#1a1a2e' }}>
                                        {userDetails.firstName} {userDetails.lastName}
                                    </Text>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <PhoneOutlined style={{ color: '#1677ff' }} />
                                            <Text>{userDetails.phoneNumber || 'Chưa cập nhật SĐT'}</Text>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <MailOutlined style={{ color: '#1677ff' }} />
                                            <Text>{userDetails.email || 'Chưa cập nhật Email'}</Text>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4 }}>
                                            <HomeOutlined style={{ color: '#1677ff', marginTop: 2 }} />
                                            <Text>
                                                {[userDetails.streetNumber, userDetails.street, userDetails.locality, userDetails.country].filter(Boolean).join(', ') || 'Chưa cập nhật địa chỉ'}
                                            </Text>
                                        </div>
                                    </div>
                                </>
                            ) : <Text type="secondary">Đang tải...</Text>}
                        </div>
                    </div>

                    {/* Phương thức thanh toán */}
                    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f0fe', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', background: 'linear-gradient(135deg, #f0f7ff, #e8f0fe)', borderBottom: '1px solid #d0e4ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CreditCardOutlined style={{ color: '#1677ff', fontSize: 18 }} />
                            <Text strong style={{ fontSize: 16, color: '#1a1a2e' }}>Phương thức thanh toán</Text>
                        </div>
                        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {/* COD */}
                            <div
                                onClick={() => setPaymentMethod('cod')}
                                style={{
                                    padding: '18px 20px', borderRadius: 12, cursor: 'pointer',
                                    border: `2px solid ${paymentMethod === 'cod' ? '#1677ff' : '#e8f0fe'}`,
                                    background: paymentMethod === 'cod' ? '#f0f7ff' : '#fff',
                                    transition: 'all 0.25s',
                                    display: 'flex', alignItems: 'center', gap: 14
                                }}
                            >
                                <div style={{ width: 44, height: 44, background: paymentMethod === 'cod' ? 'linear-gradient(135deg, #52c41a, #389e0d)' : '#f5f5f5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, transition: 'all 0.25s' }}>
                                    💵
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block', fontSize: 15, color: '#1a1a2e' }}>Thanh toán khi nhận hàng (COD)</Text>
                                    <Text style={{ color: '#6b7280', fontSize: 13 }}>Nhận hàng rồi trả tiền mặt cho nhân viên giao hàng</Text>
                                </div>
                                {paymentMethod === 'cod' && <CheckCircleFilled style={{ color: '#1677ff', fontSize: 20 }} />}
                            </div>

                            {/* VNPAY */}
                            <div
                                onClick={() => setPaymentMethod('vnpay')}
                                style={{
                                    padding: '18px 20px', borderRadius: 12, cursor: 'pointer',
                                    border: `2px solid ${paymentMethod === 'vnpay' ? '#1677ff' : '#e8f0fe'}`,
                                    background: paymentMethod === 'vnpay' ? '#f0f7ff' : '#fff',
                                    transition: 'all 0.25s',
                                    display: 'flex', alignItems: 'center', gap: 14
                                }}
                            >
                                <div style={{ width: 44, height: 44, background: paymentMethod === 'vnpay' ? 'linear-gradient(135deg, #1677ff, #0050b3)' : '#f5f5f5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, transition: 'all 0.25s' }}>
                                    🏦
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text strong style={{ display: 'block', fontSize: 15, color: '#1a1a2e' }}>VNPAY – Quét mã QR</Text>
                                    <Text style={{ color: '#6b7280', fontSize: 13 }}>Thanh toán qua App ngân hàng hoặc ví điện tử VNPAY</Text>
                                </div>
                                {paymentMethod === 'vnpay' && <CheckCircleFilled style={{ color: '#1677ff', fontSize: 20 }} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Tóm tắt đơn hàng */}
                <div style={{ width: 360, flexShrink: 0 }}>
                    <div style={{ position: 'sticky', top: 16, background: '#fff', borderRadius: 16, border: '1px solid #e8f0fe', overflow: 'hidden', boxShadow: '0 4px 20px rgba(22,119,255,0.08)' }}>
                        <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #1677ff, #0050b3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ShoppingCartOutlined style={{ color: '#fff', fontSize: 18 }} />
                            <Title level={5} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>Tóm tắt đơn hàng</Title>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div style={{ padding: '16px 20px', maxHeight: 260, overflowY: 'auto', borderBottom: '1px solid #e8f0fe' }}>
                            {selectedItems.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < selectedItems.length - 1 ? 12 : 0 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid #e8f0fe' }}>
                                        {item.product?.image
                                            ? <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <div style={{ width: '100%', height: '100%', background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛍️</div>
                                        }
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Text strong style={{ fontSize: 13, display: 'block', lineHeight: 1.4, color: '#1a1a2e' }}>
                                            {item.product?.productName}
                                        </Text>
                                        <Text style={{ color: '#6b7280', fontSize: 12 }}>x{item.quantity}</Text>
                                    </div>
                                    <Text strong style={{ color: '#f5222d', fontSize: 14 }}>{item.subTotal?.toLocaleString()}đ</Text>
                                </div>
                            ))}
                        </div>

                        {/* Tổng cộng */}
                        <div style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ color: '#6b7280' }}>Tạm tính:</Text>
                                <Text strong>{subTotal.toLocaleString()} ₫</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Text style={{ color: '#6b7280' }}>Phí vận chuyển:</Text>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <CarOutlined style={{ color: '#52c41a' }} />
                                    <Tag color="green" style={{ fontWeight: 700, margin: 0 }}>Miễn phí</Tag>
                                </div>
                            </div>

                            <Divider style={{ margin: '0 0 16px', borderColor: '#e8f0fe' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                                <Text strong style={{ fontSize: 16 }}>Tổng thanh toán:</Text>
                                <Text style={{ fontSize: 26, fontWeight: 900, color: '#f5222d', fontFamily: 'Inter' }}>
                                    {grandTotal.toLocaleString()} ₫
                                </Text>
                            </div>

                            <Button
                                type="primary" size="large" block loading={submitting}
                                onClick={handleConfirmOrder}
                                style={{
                                    height: 54, borderRadius: 12, fontWeight: 700, fontSize: 16,
                                    background: paymentMethod === 'vnpay' ? 'linear-gradient(135deg, #1677ff, #0050b3)' : 'linear-gradient(135deg, #52c41a, #389e0d)',
                                    border: 'none',
                                    boxShadow: paymentMethod === 'vnpay' ? '0 6px 20px rgba(22,119,255,0.35)' : '0 6px 20px rgba(82,196,26,0.35)'
                                }}
                            >
                                {paymentMethod === 'vnpay' ? '🏦 Thanh toán qua VNPAY' : '✓ Xác nhận Đặt hàng'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
