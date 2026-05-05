import { useEffect, useState } from 'react';
import { Button, Typography, message, Spin, Popconfirm, Empty, Tag } from 'antd';
import { DeleteOutlined, CreditCardOutlined, ShoppingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { cartApi } from '../../api/cartApi';

const { Title, Text } = Typography;

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await cartApi.getCart();
            const items = Array.isArray(res.data) ? res.data : res;
            setCartItems(items);
            setSelectedIds(items.map(i => i.id || i.productId));
        } catch (error) {
            if (error.response?.status === 404) {
                setCartItems([]);
            } else {
                message.error("Không thể tải giỏ hàng!");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const handleRemoveItem = async (productId) => {
        try {
            await cartApi.removeItem(productId);
            message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
            fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch {
            message.error("Lỗi khi xóa sản phẩm!");
        }
    };

    const toggleSelect = (itemId) => {
        setSelectedIds(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    const selectedItems = cartItems.filter(item => selectedIds.includes(item.id || item.productId));
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.subTotal || 0), 0);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '80px 0' }}><Spin size="large" tip="Đang tải giỏ hàng..." /></div>;
    }

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: 28 }}>
                <Title level={2} style={{ margin: 0, fontWeight: 900, color: '#1a1a2e' }}>
                    🛒 Giỏ Hàng
                </Title>
                <Text style={{ color: '#6b7280' }}>{cartItems.length} sản phẩm trong giỏ hàng</Text>
            </div>

            {cartItems.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '80px 40px',
                    background: '#fff', borderRadius: 20,
                    border: '2px dashed #d0e4ff'
                }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🛍️</div>
                    <Title level={4} style={{ color: '#6b7280', fontWeight: 600 }}>Giỏ hàng của bạn đang trống</Title>
                    <Text style={{ color: '#9ca3af', display: 'block', marginBottom: 24 }}>Hãy khám phá và thêm sản phẩm vào giỏ hàng nhé!</Text>
                    <Button
                        type="primary" size="large" icon={<ShoppingOutlined />}
                        onClick={() => navigate('/')}
                        style={{ height: 46, borderRadius: 10, fontWeight: 600 }}
                    >
                        Tiếp tục mua sắm
                    </Button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                    {/* Danh sách sản phẩm */}
                    <div style={{ flex: '1 1 0' }}>
                        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f0fe', overflow: 'hidden' }}>
                            {/* Header */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: '40px 80px 1fr 100px 80px 120px 80px',
                                gap: 12, padding: '14px 20px',
                                background: 'linear-gradient(135deg, #f0f7ff, #e8f0fe)',
                                borderBottom: '1px solid #d0e4ff'
                            }}>
                                {['', 'Ảnh', 'Sản phẩm', 'Đơn giá', 'SL', 'Thành tiền', 'Thao tác'].map((h, i) => (
                                    <Text key={i} strong style={{ fontSize: 12, color: '#1677ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</Text>
                                ))}
                            </div>

                            {/* Items */}
                            {cartItems.map((item, idx) => {
                                const itemId = item.id || item.productId;
                                const isSelected = selectedIds.includes(itemId);
                                return (
                                    <div key={itemId} style={{
                                        display: 'grid',
                                        gridTemplateColumns: '40px 80px 1fr 100px 80px 120px 80px',
                                        gap: 12, padding: '16px 20px',
                                        alignItems: 'center',
                                        borderBottom: idx < cartItems.length - 1 ? '1px solid #f0f5ff' : 'none',
                                        background: isSelected ? '#fafcff' : '#fff',
                                        transition: 'background 0.2s'
                                    }}>
                                        {/* Checkbox */}
                                        <div
                                            onClick={() => toggleSelect(itemId)}
                                            style={{
                                                width: 20, height: 20, borderRadius: 6, cursor: 'pointer',
                                                background: isSelected ? '#1677ff' : '#fff',
                                                border: `2px solid ${isSelected ? '#1677ff' : '#d9d9d9'}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {isSelected && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
                                        </div>

                                        {/* Ảnh */}
                                        <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', border: '1px solid #e8f0fe' }}>
                                            {item.product?.image ? (
                                                <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🛍️</div>
                                            )}
                                        </div>

                                        {/* Tên */}
                                        <Link to={`/product/${item.product?.id}`} style={{ color: '#1a1a2e', textDecoration: 'none' }}>
                                            <Text strong style={{ fontSize: 14, display: 'block', lineHeight: 1.4 }}>
                                                {item.product?.productName || 'Sản phẩm'}
                                            </Text>
                                        </Link>

                                        {/* Đơn giá */}
                                        <Text style={{ fontSize: 14, color: '#6b7280' }}>{item.price?.toLocaleString()}đ</Text>

                                        {/* SL */}
                                        <div style={{ textAlign: 'center', background: '#f0f7ff', borderRadius: 8, padding: '4px 0', fontWeight: 700, color: '#1677ff' }}>
                                            {item.quantity}
                                        </div>

                                        {/* Thành tiền */}
                                        <Text strong style={{ color: '#f5222d', fontSize: 15 }}>{item.subTotal?.toLocaleString()}đ</Text>

                                        {/* Xóa */}
                                        <Popconfirm
                                            title="Xóa khỏi giỏ hàng?"
                                            onConfirm={() => handleRemoveItem(item.product?.id || item.productId)}
                                            okText="Xóa" cancelText="Hủy"
                                        >
                                            <Button danger type="text" icon={<DeleteOutlined />} size="small" style={{ borderRadius: 8 }} />
                                        </Popconfirm>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button type="link" icon={<ShoppingOutlined />} onClick={() => navigate('/')}
                                style={{ color: '#1677ff', fontWeight: 600, paddingLeft: 0 }}>
                                Tiếp tục mua sắm
                            </Button>
                        </div>
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <div style={{ width: 320, flexShrink: 0 }}>
                        <div style={{
                            position: 'sticky', top: 16,
                            background: '#fff', borderRadius: 16,
                            border: '1px solid #e8f0fe',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(22,119,255,0.08)'
                        }}>
                            <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #1677ff, #0050b3)' }}>
                                <Title level={5} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>Tóm tắt đơn hàng</Title>
                            </div>
                            <div style={{ padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text style={{ color: '#6b7280' }}>Đã chọn ({selectedItems.length})</Text>
                                    <Text strong>{totalPrice.toLocaleString()} ₫</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <Text style={{ color: '#6b7280' }}>Phí vận chuyển</Text>
                                    <Tag color="green" style={{ fontWeight: 700 }}>Miễn phí</Tag>
                                </div>

                                <div style={{ borderTop: '2px dashed #e8f0fe', paddingTop: 16, marginBottom: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text>
                                        <Text style={{ fontSize: 28, fontWeight: 900, color: '#f5222d', fontFamily: 'Inter' }}>
                                            {totalPrice.toLocaleString()} ₫
                                        </Text>
                                    </div>
                                </div>

                                <Button
                                    type="primary" size="large" block
                                    icon={<CreditCardOutlined />}
                                    disabled={selectedItems.length === 0}
                                    onClick={() => navigate('/checkout', { state: { selectedItems } })}
                                    style={{ height: 52, borderRadius: 12, fontWeight: 700, fontSize: 16 }}
                                >
                                    Thanh Toán <ArrowRightOutlined />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
