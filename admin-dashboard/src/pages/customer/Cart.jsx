import { useEffect, useState } from 'react';
import { Table, Button, Typography, message, Spin, Popconfirm } from 'antd';
import { DeleteOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { cartApi } from '../../api/cartApi';

const { Title, Text } = Typography;

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await cartApi.getCart();
            // CartController trả về List<Object> (chứa thông tin Item).
            // Ta cần kiểm tra xem cấu trúc dữ liệu trả về như thế nào.
            // Thông thường là mảng các object.
            setCartItems(Array.isArray(res.data) ? res.data : res);
        } catch (error) {
            // Lỗi 404 là giỏ hàng trống, không cần báo lỗi đỏ lòm
            if (error.response && error.response.status === 404) {
                setCartItems([]);
            } else {
                message.error("Không thể tải giỏ hàng!");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemoveItem = async (productId) => {
        try {
            await cartApi.removeItem(productId);
            message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
            fetchCart(); // Tải lại giỏ hàng
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            message.error("Lỗi khi xóa sản phẩm!");
        }
    };

    const columns = [
        { 
            title: 'Hình ảnh', 
            dataIndex: 'product', 
            key: 'image',
            render: (prod) => (
                prod?.image ? 
                    <img src={prod.image} alt="product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} /> 
                    : 'Chưa có ảnh'
            )
        },
        { 
            title: 'Sản phẩm', 
            dataIndex: 'product', 
            key: 'product',
            render: (prod) => (
                <Link to={`/product/${prod?.id}`}>
                    <Text strong style={{ cursor: 'pointer', color: '#1890ff' }}>{prod?.productName || 'Sản phẩm'}</Text>
                </Link>
            )
        },
        { 
            title: 'Đơn giá', 
            dataIndex: 'price', 
            key: 'price',
            render: (val) => `${val?.toLocaleString()}đ`
        },
        { 
            title: 'Số lượng', 
            dataIndex: 'quantity', 
            key: 'quantity' 
        },
        { 
            title: 'Thành tiền', 
            dataIndex: 'subTotal', 
            key: 'subTotal',
            render: (val) => <Text type="danger" strong>{val?.toLocaleString()}đ</Text>
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Xóa khỏi giỏ hàng?"
                    onConfirm={() => handleRemoveItem(record.product?.id || record.productId)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button danger icon={<DeleteOutlined />} type="text">Xóa</Button>
                </Popconfirm>
            )
        }
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const selectedItems = cartItems.filter(item => 
        selectedRowKeys.includes(item.id || item.productId)
    );

    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.subTotal || 0), 0);

    return (
        <div style={{ background: '#fff', padding: 48, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Title level={2} style={{ marginBottom: 32, fontWeight: 800 }}>Giỏ hàng của bạn</Title>
            
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 60%' }}>
                    <Table 
                        rowSelection={rowSelection}
                        dataSource={cartItems} 
                        columns={columns} 
                        rowKey={(record) => record.id || record.productId}
                        loading={loading}
                        pagination={false}
                        locale={{ emptyText: 'Giỏ hàng đang trống' }}
                    />
                </div>

                {cartItems.length > 0 && (
                    <div style={{ flex: '1 1 30%', minWidth: 300 }}>
                        <div style={{ position: 'sticky', top: 120, padding: 32, background: '#fafafa', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                            <Title level={4} style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: 16, marginBottom: 24 }}>Tóm tắt đơn hàng</Title>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <Text type="secondary" style={{ fontSize: 16 }}>Đã chọn ({selectedItems.length} sản phẩm)</Text>
                                <Text strong style={{ fontSize: 16 }}>{totalPrice.toLocaleString()} ₫</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                                <Text type="secondary" style={{ fontSize: 16 }}>Phí giao hàng</Text>
                                <Text strong style={{ fontSize: 16, color: '#52c41a' }}>Miễn phí</Text>
                            </div>

                            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 24, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: 18 }}>Tổng cộng:</Text>
                                <Text type="danger" strong style={{ fontSize: 28, lineHeight: 1 }}>{totalPrice.toLocaleString()} ₫</Text>
                            </div>

                            <Button 
                                type="primary" 
                                size="large" 
                                icon={<CreditCardOutlined style={{ fontSize: 20 }} />}
                                style={{ width: '100%', height: 56, fontSize: 18, fontWeight: 600, borderRadius: 8, background: 'linear-gradient(90deg, #1890ff 0%, #0050b3 100%)', border: 'none' }}
                                disabled={selectedRowKeys.length === 0}
                                onClick={() => navigate('/checkout', { state: { selectedItems } })}
                            >
                                Mua Hàng
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
