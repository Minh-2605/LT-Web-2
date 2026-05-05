import React, { useEffect, useState } from 'react';
import { Typography, Tag, Button, message, Spin, Popconfirm, Empty } from 'antd';
import { orderApi } from '../../api/orderApi';
import { useNavigate } from 'react-router-dom';
import { ShoppingOutlined, ClockCircleOutlined, CheckCircleOutlined, CarOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const statusConfig = {
    'PAYMENT_EXPECTED': { color: '#faad14', bg: '#fffbe6', border: '#ffe58f', label: 'Chờ thanh toán', icon: <ClockCircleOutlined /> },
    'PAID': { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f', label: 'Đã thanh toán', icon: <CheckCircleOutlined /> },
    'SHIPPING': { color: '#1677ff', bg: '#e6f4ff', border: '#91caff', label: 'Đang giao hàng', icon: <CarOutlined /> },
    'DELIVERED': { color: '#722ed1', bg: '#f9f0ff', border: '#d3adf7', label: 'Đã giao hàng', icon: <CheckCircleOutlined /> },
    'CANCELED': { color: '#ff4d4f', bg: '#fff1f0', border: '#ffa39e', label: 'Đã hủy', icon: <CloseCircleOutlined /> },
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) { message.error("Vui lòng đăng nhập!"); navigate('/login'); return; }
            const user = JSON.parse(userStr);
            const res = await orderApi.getUserOrders(user.id);
            setOrders(res.data || []);
        } catch (error) {
            message.error("Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, [navigate]);

    const handleCancelOrder = async (orderId) => {
        try {
            message.loading({ content: 'Đang hủy đơn...', key: 'cancel' });
            await orderApi.updateStatus(orderId, 'CANCELED');
            message.success({ content: 'Đã hủy đơn hàng!', key: 'cancel' });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELED' } : o));
        } catch {
            message.error({ content: 'Hủy đơn thất bại!', key: 'cancel' });
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '80px 0' }}><Spin size="large" /></div>;

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <Title level={2} style={{ margin: 0, fontWeight: 900, color: '#1a1a2e' }}>📦 Đơn Hàng Của Tôi</Title>
                <Text style={{ color: '#6b7280' }}>{orders.length} đơn hàng</Text>
            </div>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: 20, border: '2px dashed #d0e4ff' }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
                    <Title level={4} style={{ color: '#6b7280' }}>Bạn chưa có đơn hàng nào</Title>
                    <Button type="primary" size="large" icon={<ShoppingOutlined />} onClick={() => navigate('/')}
                        style={{ height: 46, borderRadius: 10, fontWeight: 600, marginTop: 12 }}>
                        Mua sắm ngay
                    </Button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {orders.map(order => {
                        const sc = statusConfig[order.status] || { color: '#6b7280', bg: '#fafafa', border: '#d9d9d9', label: order.status, icon: null };
                        const canCancel = order.status === 'PAYMENT_EXPECTED';

                        return (
                            <div key={order.id} style={{
                                background: '#fff', borderRadius: 16,
                                border: '1px solid #e8f0fe',
                                overflow: 'hidden',
                                boxShadow: '0 2px 12px rgba(22,119,255,0.05)',
                                transition: 'all 0.25s'
                            }}>
                                {/* Order Header */}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '14px 24px',
                                    background: 'linear-gradient(135deg, #f0f7ff, #e8f0fe)',
                                    borderBottom: '1px solid #d0e4ff'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                        <Text strong style={{ color: '#1677ff', fontSize: 15 }}>#{order.id}</Text>
                                        <Text style={{ color: '#6b7280', fontSize: 13 }}>
                                            📅 {new Date(order.orderedDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </Text>
                                        <Text style={{ color: '#6b7280', fontSize: 13 }}>
                                            {order.items?.length || 0} sản phẩm
                                        </Text>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 6,
                                            padding: '5px 14px', borderRadius: 20,
                                            background: sc.bg, border: `1px solid ${sc.border}`,
                                            color: sc.color, fontWeight: 700, fontSize: 13
                                        }}>
                                            {sc.icon} {sc.label}
                                        </div>

                                        {canCancel && (
                                            <Popconfirm
                                                title="Bạn có chắc muốn hủy đơn hàng này?"
                                                onConfirm={() => handleCancelOrder(order.id)}
                                                okText="Đồng ý" cancelText="Không"
                                            >
                                                <Button danger size="small" style={{ borderRadius: 8, fontWeight: 600 }}>
                                                    Hủy đơn
                                                </Button>
                                            </Popconfirm>
                                        )}
                                    </div>
                                </div>

                                {/* Items */}
                                <div style={{ padding: '16px 24px' }}>
                                    {order.items?.slice(0, 3).map((item, i) => (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'center', gap: 16,
                                            paddingBottom: i < Math.min(order.items.length, 3) - 1 ? 12 : 0,
                                            marginBottom: i < Math.min(order.items.length, 3) - 1 ? 12 : 0,
                                            borderBottom: i < Math.min(order.items.length, 3) - 1 ? '1px solid #f0f5ff' : 'none'
                                        }}>
                                            <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid #e8f0fe', background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {item.product?.image
                                                    ? <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : <span style={{ fontSize: 22 }}>🛍️</span>
                                                }
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Text strong style={{ fontSize: 14, color: '#1a1a2e', display: 'block' }}>
                                                    {item.product?.productName || 'Sản phẩm'}
                                                </Text>
                                                <Text style={{ color: '#6b7280', fontSize: 13 }}>x{item.quantity}</Text>
                                            </div>
                                            <Text strong style={{ color: '#f5222d', fontSize: 15 }}>
                                                {item.subTotal?.toLocaleString()}đ
                                            </Text>
                                        </div>
                                    ))}
                                    {order.items?.length > 3 && (
                                        <Text style={{ color: '#1677ff', fontSize: 13 }}>+{order.items.length - 3} sản phẩm khác</Text>
                                    )}
                                </div>

                                {/* Footer */}
                                <div style={{
                                    display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                                    padding: '12px 24px', borderTop: '1px solid #f0f5ff',
                                    background: '#fafcff'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Text style={{ color: '#6b7280', fontSize: 15 }}>Tổng:</Text>
                                        <Text style={{ fontSize: 22, fontWeight: 900, color: '#f5222d', fontFamily: 'Inter' }}>
                                            {order.total?.toLocaleString()} ₫
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;
