import { Table, Tag, message, Typography } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { paymentApi } from '../api/paymentApi';

const { Text, Title } = Typography;

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await paymentApi.getAllPayments();
            setPayments(Array.isArray(res.data) ? res.data : res);
        } catch {
            message.error("Không thể tải danh sách thanh toán!");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPayments(); }, [fetchPayments]);

    const columns = [
        { title: 'Mã TT', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Mã Đơn Hàng', dataIndex: 'orderId', key: 'orderId' },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (val) => <Text strong type="success">{val?.toLocaleString()}đ</Text>
        },
        { 
            title: 'Phương thức', 
            dataIndex: 'paymentMethod', 
            key: 'paymentMethod',
            render: (method) => <Tag color="geekblue">{method || 'N/A'}</Tag>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'green';
                if (status === 'PENDING') color = 'gold';
                if (status === 'FAILED') color = 'red';
                return <Tag color={color}>{status || 'SUCCESS'}</Tag>;
            }
        },
        { 
            title: 'Ngày thanh toán', 
            dataIndex: 'paymentDate', 
            key: 'paymentDate',
            render: (date) => date ? new Date(date).toLocaleString() : 'N/A'
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3} style={{ margin: 0, marginBottom: '8px' }}>Quản lý Thanh toán</Title>
                <Text type="secondary">Theo dõi các giao dịch thanh toán từ hệ thống.</Text>
            </div>
            <Table
                dataSource={payments}
                columns={columns}
                rowKey="id"
                loading={loading}
            />
        </div>
    );
};

export default PaymentList;
