import { Table, Tag, message, Select, Typography, Input } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { orderApi } from '../api/orderApi';
import { SearchOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const statusConfig = {
    'PAYMENT_EXPECTED': { color: '#faad14', bg: '#fffbe6', border: '#ffe58f', label: 'Chờ thanh toán' },
    'PAID': { color: '#1677ff', bg: '#e6f4ff', border: '#91caff', label: 'Đã thanh toán' },
    'SHIPPING': { color: '#722ed1', bg: '#f9f0ff', border: '#d3adf7', label: 'Đang giao hàng' },
    'DELIVERED': { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f', label: 'Đã giao thành công' },
    'CANCELLED': { color: '#ff4d4f', bg: '#fff1f0', border: '#ffa39e', label: 'Đã hủy đơn' },
    'CANCELED': { color: '#ff4d4f', bg: '#fff1f0', border: '#ffa39e', label: 'Đã hủy đơn' },
};

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await orderApi.getAllOrders();
            const data = Array.isArray(res.data) ? res.data : res;
            setOrders(data);
            setFiltered(data);
        } catch {
            message.error("Không thể tải danh sách đơn hàng!");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    useEffect(() => {
        setFiltered(search ? orders.filter(o =>
            String(o.id).includes(search) ||
            o.user?.userName?.toLowerCase().includes(search.toLowerCase())
        ) : orders);
    }, [search, orders]);

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
        const cols = [
            {
                title: 'Sản phẩm', key: 'product',
                render: (_, item) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {item.product?.image && <img src={item.product.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />}
                        <Text strong>{item.product?.productName}</Text>
                    </div>
                )
            },
            { title: 'SL', dataIndex: 'quantity', key: 'quantity', width: 60 },
            {
                title: 'Thành tiền', dataIndex: 'subTotal', key: 'subTotal',
                render: (val) => <Text strong style={{ color: '#f5222d' }}>{val?.toLocaleString()}đ</Text>
            },
        ];
        return (
            <div style={{ padding: '12px 16px', background: '#f8faff', borderRadius: 10 }}>
                <Table columns={cols} dataSource={record.items} pagination={false} rowKey="id" size="small" />
            </div>
        );
    };

    const columns = [
        {
            title: 'Mã đơn', dataIndex: 'id', key: 'id', width: 90,
            render: (id) => <Text strong style={{ color: '#1677ff' }}>#{id}</Text>
        },
        {
            title: 'Ngày đặt', dataIndex: 'orderedDate', key: 'orderedDate',
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '—'
        },
        {
            title: 'Khách hàng', dataIndex: ['user', 'userName'], key: 'userName',
            render: (name) => <Text strong>{name || '—'}</Text>
        },
        {
            title: 'Tổng cộng', dataIndex: 'total', key: 'total',
            render: (val) => <Text strong style={{ color: '#f5222d', fontSize: 15 }}>{val?.toLocaleString()}đ</Text>
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (status, record) => {
                const sc = statusConfig[status] || {};
                return (
                    <Select
                        value={status}
                        style={{ width: 210 }}
                        onChange={(val) => handleStatusChange(record.id, val)}
                        labelRender={({ value }) => {
                            const s = statusConfig[value] || {};
                            return (
                                <span style={{ color: s.color, fontWeight: 700 }}>● {s.label || value}</span>
                            );
                        }}
                    >
                        {Object.entries(statusConfig).slice(0, 5).map(([val, cfg]) => (
                            <Select.Option key={val} value={val}>
                                <Tag style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 6, fontWeight: 700 }}>
                                    {cfg.label}
                                </Tag>
                            </Select.Option>
                        ))}
                    </Select>
                );
            }
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>🧾 Quản lý Đơn hàng</Title>
                    <Text style={{ color: '#6b7280' }}>{filtered.length} đơn hàng · Bấm vào mỗi đơn để xem chi tiết</Text>
                </div>
                <Input
                    prefix={<SearchOutlined style={{ color: '#1677ff' }} />}
                    placeholder="Tìm theo mã hoặc khách hàng..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: 260, borderRadius: 10, height: 40 }}
                    allowClear
                />
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f0fe', overflow: 'hidden', boxShadow: '0 2px 12px rgba(22,119,255,0.05)' }}>
                <Table
                    dataSource={filtered} columns={columns} rowKey="id"
                    expandable={{ expandedRowRender }}
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                />
            </div>
        </div>
    );
};

export default OrderList;