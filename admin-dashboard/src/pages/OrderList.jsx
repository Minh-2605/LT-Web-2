import { Table, Tag, message, Select, Typography, Button } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { orderApi } from '../api/orderApi';

const { Text, Title } = Typography;

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await orderApi.getAllOrders();
            // Nếu axiosClient của bạn trả về thẳng data thì dùng res, 
            // còn nếu trả về nguyên response thì dùng res.data
            setOrders(Array.isArray(res.data) ? res.data : res);
        } catch {
            message.error("Không thể tải danh sách đơn hàng!");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderApi.updateStatus(orderId, newStatus);
            message.success("Cập nhật trạng thái thành công!");
            fetchOrders();
        } catch {
            message.error("Cập nhật thất bại!");
        }
    };

    const expandedRowRender = (record) => {
        const columns = [
            { title: 'Sản phẩm', dataIndex: ['product', 'productName'], key: 'productName' },
            { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
            {
                title: 'Thành tiền',
                dataIndex: 'subTotal',
                key: 'subTotal',
                render: (val) => <Text strong>{val?.toLocaleString()}đ</Text>
            },
        ];
        return <Table columns={columns} dataSource={record.items} pagination={false} rowKey="id" size="small" />;
    };

    const columns = [
        { title: 'Mã đơn', dataIndex: 'id', key: 'id', width: 100 },
        { title: 'Ngày đặt', dataIndex: 'orderedDate', key: 'orderedDate' },
        { title: 'Khách hàng', dataIndex: ['user', 'userName'], key: 'userName' },
        {
            title: 'Tổng cộng',
            dataIndex: 'total',
            key: 'total',
            render: (val) => <Text strong type="danger">{val?.toLocaleString()}đ</Text>
        },
        {
            title: 'Trạng thái đơn hàng',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    defaultValue={status}
                    style={{ width: 200 }}
                    onChange={(val) => handleStatusChange(record.id, val)}
                >
                    <Select.Option value="PAYMENT_EXPECTED"><Tag color="gold">Chờ thanh toán</Tag></Select.Option>
                    <Select.Option value="PAID"><Tag color="blue">Đã thanh toán (Chờ giao)</Tag></Select.Option>
                    <Select.Option value="SHIPPING"><Tag color="purple">Đang giao hàng</Tag></Select.Option>
                    <Select.Option value="DELIVERED"><Tag color="green">Đã giao thành công</Tag></Select.Option>
                    <Select.Option value="CANCELLED"><Tag color="red">Đã hủy đơn</Tag></Select.Option>
                </Select>
            )
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3} style={{ margin: 0, marginBottom: '8px' }}>Quản lý Đơn hàng</Title>
                <Text type="secondary">Cập nhật trạng thái để khách hàng theo dõi lộ trình đơn hàng.</Text>
            </div>
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="id"
                expandable={{ expandedRowRender }}
                loading={loading}
            />
        </div>
    );
};

export default OrderList;