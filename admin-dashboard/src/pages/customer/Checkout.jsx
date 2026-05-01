import { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Button, message, Spin, Divider, Table, Radio } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
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

    // Lấy selectedItems từ Cart truyền sang
    const selectedItems = location.state?.selectedItems || [];

    useEffect(() => {
        if (selectedItems.length === 0) {
            message.warning("Không có sản phẩm nào để thanh toán!");
            navigate('/cart');
            return;
        }

        const fetchUser = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    message.error("Vui lòng đăng nhập để thanh toán!");
                    navigate('/login');
                    return;
                }
                const currentUser = JSON.parse(userStr);
                const res = await userApi.getById(currentUser.id);
                // Giả định API trả về User có chứa thuộc tính userDetails
                if (res.data?.userDetails) {
                    setUserDetails(res.data.userDetails);
                } else {
                    message.warning("Vui lòng cập nhật địa chỉ giao hàng trong trang Cá nhân!");
                    navigate('/profile');
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin user", error);
                message.error("Không thể tải thông tin người dùng!");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate, selectedItems.length]);

    const subTotal = selectedItems.reduce((sum, item) => sum + (item.subTotal || 0), 0);
    const shippingFee = 30000;
    const grandTotal = subTotal + shippingFee;

    const handleConfirmOrder = async () => {
        setSubmitting(true);
        try {
            const userStr = localStorage.getItem('user');
            const currentUser = JSON.parse(userStr);
            
            // Lấy danh sách ID các item được chọn
            const itemIds = selectedItems.map(item => item.id || item.productId);
            
            // Lưu order xuống orders_db
            const res = await orderApi.saveOrder(currentUser.id, itemIds);
            const savedOrder = res.data;
            
            window.dispatchEvent(new Event('cartUpdated')); // Update cart badge
            
            if (paymentMethod === 'vnpay') {
                // Gọi API tạo link VNPAY
                const vnpayRes = await paymentApi.createVNPayUrl(grandTotal, `Thanh toan don hang ${savedOrder.id}`);
                if (vnpayRes.data && vnpayRes.data.data) {
                    message.loading("Đang chuyển hướng sang cổng thanh toán VNPAY...", 2);
                    window.location.href = vnpayRes.data.data;
                } else {
                    message.error("Không thể tạo link thanh toán VNPAY");
                }
            } else {
                // Lưu lịch sử thanh toán COD
                await paymentApi.savePayment({
                    orderId: savedOrder.id,
                    amount: grandTotal,
                    paymentMethod: 'COD',
                    status: 'PENDING'
                });
                message.success("Đặt hàng thành công!");
                navigate('/orders'); // Hoặc chuyển sang trang lịch sử đơn hàng
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            message.error("Có lỗi xảy ra khi đặt hàng!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>;
    }

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (prod) => <Text strong>{prod?.productName || 'Sản phẩm'}</Text>
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Tạm tính',
            dataIndex: 'subTotal',
            key: 'subTotal',
            render: (val) => <Text>{val?.toLocaleString()}đ</Text>
        }
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0' }}>
            <Title level={2} style={{ marginBottom: 32, fontWeight: 800 }}>Thanh toán đơn hàng</Title>
            
            <Row gutter={40}>
                {/* Cột trái: Thông tin giao hàng */}
                <Col span={14}>
                    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: 24 }}>
                        <Title level={4} style={{ marginBottom: 24 }}>Thông tin giao hàng</Title>
                        {userDetails ? (
                            <div style={{ fontSize: 16, lineHeight: '2' }}>
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong style={{ fontSize: 18 }}>
                                        {userDetails.firstName} {userDetails.lastName}
                                    </Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><PhoneOutlined style={{ color: '#bfbfbf' }} /> <Text>{userDetails.phoneNumber || 'Chưa cập nhật SĐT'}</Text></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><MailOutlined style={{ color: '#bfbfbf' }} /> <Text>{userDetails.email || 'Chưa cập nhật Email'}</Text></div>
                                
                                <div style={{ padding: '16px 20px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <HomeOutlined style={{ color: '#bfbfbf' }} /> <Text strong>Địa chỉ nhận hàng</Text>
                                    </div>
                                    <Text style={{ display: 'block', marginLeft: 24 }}>
                                        {userDetails.streetNumber} {userDetails.street}, {userDetails.locality}, {userDetails.country}
                                    </Text>
                                </div>
                                <div style={{ marginTop: 16, textAlign: 'right' }}>
                                    <Button type="link" onClick={() => navigate('/profile')} style={{ padding: 0, fontWeight: 500 }}>
                                        Chỉnh sửa thông tin
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>Đang tải thông tin...</div>
                        )}
                    </div>

                    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <Title level={4} style={{ marginBottom: 24 }}>Phương thức thanh toán</Title>
                        <Radio.Group 
                            onChange={(e) => setPaymentMethod(e.target.value)} 
                            value={paymentMethod}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
                        >
                            <Radio value="cod" style={{ fontSize: 16, padding: '20px', border: paymentMethod === 'cod' ? '2px solid #1890ff' : '1px solid #d9d9d9', borderRadius: 12, background: paymentMethod === 'cod' ? '#e6f7ff' : '#fff', transition: 'all 0.3s' }}>
                                <Text strong>Thanh toán khi nhận hàng (COD)</Text>
                                <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>Nhận hàng rồi mới thanh toán tiền mặt</div>
                            </Radio>
                            <Radio value="vnpay" style={{ fontSize: 16, padding: '20px', border: paymentMethod === 'vnpay' ? '2px solid #1890ff' : '1px solid #d9d9d9', borderRadius: 12, background: paymentMethod === 'vnpay' ? '#e6f7ff' : '#fff', transition: 'all 0.3s' }}>
                                <Text strong style={{ color: paymentMethod === 'vnpay' ? '#1890ff' : 'inherit' }}>Thanh toán Online (VNPAY - Quét mã QR)</Text>
                                <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>Hỗ trợ quét mã QR qua ứng dụng ngân hàng hoặc ví VNPAY</div>
                            </Radio>
                        </Radio.Group>
                    </div>
                </Col>

                {/* Cột phải: Đơn hàng */}
                <Col span={10}>
                    <div style={{ position: 'sticky', top: 120, background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <Title level={4} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 24 }}>
                            <ShoppingCartOutlined style={{ marginRight: 8 }} /> Tóm tắt đơn hàng
                        </Title>
                        <Table 
                            dataSource={selectedItems}
                            columns={columns}
                            pagination={false}
                            rowKey={(record) => record.id || record.productId}
                            size="middle"
                        />
                        
                        <div style={{ marginTop: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Text type="secondary" style={{ fontSize: 16 }}>Tiền hàng:</Text>
                                <Text strong style={{ fontSize: 16 }}>{subTotal.toLocaleString()} ₫</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                                <Text type="secondary" style={{ fontSize: 16 }}>Phí vận chuyển:</Text>
                                <Text strong style={{ fontSize: 16 }}>{shippingFee.toLocaleString()} ₫</Text>
                            </div>
                            
                            <Divider style={{ margin: '24px 0' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                                <Text strong style={{ fontSize: 18 }}>Tổng thanh toán:</Text>
                                <Text type="danger" strong style={{ fontSize: 28, lineHeight: 1 }}>{grandTotal.toLocaleString()} ₫</Text>
                            </div>

                            <Button 
                                type="primary" 
                                size="large" 
                                block 
                                loading={submitting}
                                onClick={handleConfirmOrder}
                                style={{ height: 56, fontSize: 18, fontWeight: 600, borderRadius: 8, background: paymentMethod === 'vnpay' ? '#1890ff' : '#52c41a', border: 'none' }}
                            >
                                {paymentMethod === 'vnpay' ? 'Thanh toán qua VNPAY' : 'Xác nhận Đặt hàng'}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Checkout;
