import React, { useEffect, useState } from 'react';
import { Typography, Table, Tag, Button, message, Spin, Popconfirm } from 'antd';
import { orderApi } from '../../api/orderApi';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                message.error("Vui lòng đăng nhập để xem đơn hàng!");
                navigate('/login');
                return;
            }
            const user = JSON.parse(userStr);
            const res = await orderApi.getUserOrders(user.id);
            setOrders(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
            message.error("Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [navigate]);

    const handleCancelOrder = async (orderId) => {
        try {
            message.loading({ content: 'Đang hủy đơn...', key: 'cancel' });
            await orderApi.updateStatus(orderId, 'CANCELED');
            message.success({ content: 'Đã hủy đơn hàng thành công!', key: 'cancel' });
            // Cập nhật lại list ngay lập tức
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: 'CANCELED' } : order
                )
            );
        } catch (error) {
            console.error("Lỗi khi hủy đơn:", error);
            message.error({ content: 'Hủy đơn thất bại!', key: 'cancel' });
        }
    };

    const columns = [
        {
            title: 'Mã ĐH',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Text strong>#{text}</Text>,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'orderedDate',
            key: 'orderedDate',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            render: (val) => <Text style={{ color: '#f5222d', fontWeight: 'bold' }}>{val?.toLocaleString()}đ</Text>
        },
        {
            title: 'Sản phẩm',
            key: 'items',
            render: (_, record) => {
                const count = record.items?.length || 0;
                return <Text>{count} sản phẩm</Text>;
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                let text = status;

                switch (status) {
                    case 'PAYMENT_EXPECTED': color = 'orange'; text = 'Chờ thanh toán'; break;
                    case 'PAID': color = 'green'; text = 'Đã thanh toán'; break;
                    case 'DELIVERED': color = 'blue'; text = 'Đã giao hàng'; break;
                    case 'CANCELED': color = 'red'; text = 'Đã hủy'; break;
                    case 'SHIPPING': color = 'purple'; text = 'Đang giao hàng'; break;
                    default: break;
                }

                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => {
                const canCancel = record.status === 'PAYMENT_EXPECTED';

                if (canCancel) {
                    return (
                        <Popconfirm
                            title="Bạn có chắc chắn muốn hủy đơn hàng này?"
                            onConfirm={() => handleCancelOrder(record.id)}
                            okText="Đồng ý"
                            cancelText="Không"
                        >
                            <Button danger type="text" size="small">Hủy đơn</Button>
                        </Popconfirm>
                    );
                }
                return null;
            }
        }
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', background: '#fff', padding: 48, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <Title level={2} style={{ marginBottom: 32, fontWeight: 800 }}>Lịch sử mua hàng</Title>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>
            ) : (
                <Table
                    dataSource={orders}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'Bạn chưa có đơn hàng nào.' }}
                    style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}
                />
            )}
        </div>
    );
};

export default Orders;
