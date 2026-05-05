import { Table, Tag, message, Typography, Input } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { paymentApi } from '../api/paymentApi';
import { SearchOutlined, CreditCardOutlined, WalletOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const methodConfig = {
    'VNPAY': { icon: '🏦', color: '#1677ff', bg: '#e6f4ff', border: '#91caff' },
    'COD': { icon: '💵', color: '#389e0d', bg: '#f6ffed', border: '#b7eb8f' },
};

const statusConfig = {
    'SUCCESS': { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f', label: '✓ Thành công' },
    'PENDING': { color: '#faad14', bg: '#fffbe6', border: '#ffe58f', label: '⏳ Chờ xử lý' },
    'FAILED': { color: '#ff4d4f', bg: '#fff1f0', border: '#ffa39e', label: '✗ Thất bại' },
};

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await paymentApi.getAllPayments();
            const data = Array.isArray(res.data) ? res.data : res;
            setPayments(data);
            setFiltered(data);
        } catch {
            message.error("Không thể tải danh sách thanh toán!");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPayments(); }, [fetchPayments]);

    useEffect(() => {
        setFiltered(search
            ? payments.filter(p => String(p.orderId).includes(search) || p.paymentMethod?.toLowerCase().includes(search.toLowerCase()))
            : payments
        );
    }, [search, payments]);

    const totalRevenue = payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + (p.amount || 0), 0);

    const columns = [
        {
            title: 'Mã TT', dataIndex: 'id', key: 'id', width: 90,
            render: (id) => <Text strong style={{ color: '#1677ff' }}>#{id}</Text>
        },
        {
            title: 'Mã Đơn hàng', dataIndex: 'orderId', key: 'orderId',
            render: (id) => <Text strong>#{id}</Text>
        },
        {
            title: 'Số tiền', dataIndex: 'amount', key: 'amount',
            render: (val) => <Text strong style={{ color: '#f5222d', fontSize: 15 }}>{val?.toLocaleString()} ₫</Text>
        },
        {
            title: 'Phương thức', dataIndex: 'paymentMethod', key: 'paymentMethod',
            render: (method) => {
                const cfg = methodConfig[method] || { icon: '💳', color: '#6b7280', bg: '#f5f5f5', border: '#d9d9d9' };
                return (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 8, color: cfg.color, fontWeight: 700 }}>
                        {cfg.icon} {method || 'N/A'}
                    </div>
                );
            }
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (status) => {
                const sc = statusConfig[status] || { color: '#6b7280', bg: '#f5f5f5', border: '#d9d9d9', label: status };
                return (
                    <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 8, color: sc.color, fontWeight: 700, fontSize: 13 }}>
                        {sc.label}
                    </div>
                );
            }
        },
        {
            title: 'Ngày thanh toán', dataIndex: 'paymentDate', key: 'paymentDate',
            render: (date) => date ? (
                <Text style={{ color: '#6b7280' }}>{new Date(date).toLocaleString('vi-VN')}</Text>
            ) : <Text type="secondary">—</Text>
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                        <CreditCardOutlined style={{ color: '#1677ff', marginRight: 10 }} />Quản lý Thanh toán
                    </Title>
                    <Text style={{ color: '#6b7280' }}>{filtered.length} giao dịch</Text>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ background: 'linear-gradient(135deg, #f6ffed, #d9f7be)', border: '1px solid #b7eb8f', borderRadius: 12, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <WalletOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                        <div>
                            <Text style={{ color: '#6b7280', fontSize: 12, display: 'block' }}>Doanh thu</Text>
                            <Text strong style={{ color: '#389e0d', fontSize: 16 }}>{totalRevenue.toLocaleString()} ₫</Text>
                        </div>
                    </div>
                    <Input
                        prefix={<SearchOutlined style={{ color: '#1677ff' }} />}
                        placeholder="Tìm theo mã đơn hoặc phương thức..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: 280, borderRadius: 10, height: 40 }}
                        allowClear
                    />
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f0fe', overflow: 'hidden', boxShadow: '0 2px 12px rgba(22,119,255,0.05)' }}>
                <Table
                    dataSource={filtered}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                />
            </div>
        </div>
    );
};

export default PaymentList;
