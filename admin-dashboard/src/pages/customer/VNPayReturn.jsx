import { useEffect, useState, useRef } from 'react';
import { Button, Spin, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { paymentApi } from '../../api/paymentApi';
import { CheckCircleFilled, CloseCircleFilled, HomeOutlined, UnorderedListOutlined, LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const VNPayReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        const processPaymentResult = async () => {
            processedRef.current = true;
            const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
            const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
            if (vnp_ResponseCode === '00') {
                try {
                    const orderIdStr = vnp_OrderInfo.split(' ').pop();
                    const orderId = parseInt(orderIdStr, 10);
                    if (!isNaN(orderId)) {
                        await orderApi.updateStatus(orderId, 'PAID');
                        const amountStr = searchParams.get('vnp_Amount');
                        const amount = amountStr ? parseFloat(amountStr) / 100 : 0;
                        try {
                            await paymentApi.savePayment({ orderId, amount, paymentMethod: 'VNPAY', status: 'SUCCESS' });
                        } catch {}
                        setStatus('success');
                    } else {
                        setStatus('error');
                    }
                } catch {
                    setStatus('error');
                }
            } else {
                setStatus('error');
            }
        };
        if (searchParams.toString()) processPaymentResult();
        else navigate('/');
    }, [searchParams, navigate]);

    if (status === 'processing') {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 80, height: 80,
                        background: 'linear-gradient(135deg, #1677ff, #0050b3)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(22,119,255,0.35)'
                    }}>
                        <LoadingOutlined style={{ fontSize: 36, color: '#fff' }} spin />
                    </div>
                    <Text style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', display: 'block' }}>Đang xử lý thanh toán...</Text>
                    <Text style={{ color: '#6b7280' }}>Vui lòng không đóng trang này</Text>
                </div>
            </div>
        );
    }

    const isSuccess = status === 'success';

    return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                background: '#fff', borderRadius: 24,
                padding: '56px 64px', textAlign: 'center',
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                border: '1px solid #e8f0fe',
                maxWidth: 520, width: '100%'
            }}>
                {/* Icon */}
                <div style={{
                    width: 100, height: 100,
                    background: isSuccess ? 'linear-gradient(135deg, #52c41a, #389e0d)' : 'linear-gradient(135deg, #ff4d4f, #cf1322)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 28px',
                    boxShadow: isSuccess ? '0 12px 32px rgba(82,196,26,0.35)' : '0 12px 32px rgba(255,77,79,0.35)'
                }}>
                    {isSuccess
                        ? <CheckCircleFilled style={{ fontSize: 52, color: '#fff' }} />
                        : <CloseCircleFilled style={{ fontSize: 52, color: '#fff' }} />
                    }
                </div>

                <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e', margin: '0 0 12px' }}>
                    {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                </h2>
                <Text style={{ fontSize: 16, color: '#6b7280', display: 'block', marginBottom: 36, lineHeight: 1.6 }}>
                    {isSuccess
                        ? 'Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị giao.'
                        : 'Giao dịch bị hủy hoặc xảy ra lỗi. Đơn hàng của bạn vẫn được lưu với trạng thái "Chưa thanh toán".'
                    }
                </Text>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        type="primary" size="large"
                        icon={<UnorderedListOutlined />}
                        onClick={() => navigate('/orders')}
                        style={{ height: 48, borderRadius: 12, fontWeight: 700, padding: '0 28px' }}
                    >
                        Xem đơn hàng
                    </Button>
                    <Button
                        size="large"
                        icon={<HomeOutlined />}
                        onClick={() => navigate('/')}
                        style={{ height: 48, borderRadius: 12, fontWeight: 600, padding: '0 28px', border: '1px solid #d0e4ff', color: '#1677ff' }}
                    >
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VNPayReturn;
