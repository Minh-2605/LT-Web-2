import { useEffect, useState, useRef } from 'react';
import { Result, Button, Spin, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { paymentApi } from '../../api/paymentApi';

const { Text } = Typography;

const VNPayReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success, error
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        
        const processPaymentResult = async () => {
            processedRef.current = true;
            const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
            const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
            
            if (vnp_ResponseCode === '00') {
                try {
                    // Extract orderId from vnp_OrderInfo (format: "Thanh toan don hang {id}")
                    const orderIdStr = vnp_OrderInfo.split(' ').pop();
                    const orderId = parseInt(orderIdStr, 10);
                    
                    if (!isNaN(orderId)) {
                        // Update order status to PAID
                        await orderApi.updateStatus(orderId, 'PAID');
                        
                        // Parse amount từ tham số (VNPAY nhân 100)
                        const amountStr = searchParams.get('vnp_Amount');
                        const amount = amountStr ? parseFloat(amountStr) / 100 : 0;

                        // Lưu lịch sử thanh toán VNPAY
                        try {
                            await paymentApi.savePayment({
                                orderId: orderId,
                                amount: amount,
                                paymentMethod: 'VNPAY',
                                status: 'SUCCESS'
                            });
                        } catch (err) {
                            console.error("Không thể lưu lịch sử thanh toán", err);
                        }

                        setStatus('success');
                    } else {
                        setStatus('error');
                    }
                } catch (error) {
                    console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
                    setStatus('error'); // Dù lỗi cập nhật thì tiền đã trừ, thực tế cần check kỹ hơn
                }
            } else {
                setStatus('error');
            }
        };

        if (searchParams.toString()) {
            processPaymentResult();
        } else {
            navigate('/');
        }
    }, [searchParams, navigate]);

    if (status === 'processing') {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div style={{ padding: '50px 0' }}>
                <Result
                    status="success"
                    title="Thanh toán VNPAY thành công!"
                    subTitle="Đơn hàng của bạn đã được thanh toán và đang chờ giao hàng."
                    extra={[
                        <Button type="primary" key="orders" onClick={() => navigate('/orders')}>
                            Xem đơn hàng
                        </Button>,
                        <Button key="home" onClick={() => navigate('/')}>
                            Về Trang Chủ
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '50px 0' }}>
            <Result
                status="error"
                title="Thanh toán thất bại hoặc bị hủy"
                subTitle={<Text>Vui lòng kiểm tra lại quá trình thanh toán. Đơn hàng của bạn vẫn đã được lưu lại với trạng thái Chưa thanh toán.</Text>}
                extra={[
                    <Button type="primary" key="orders" onClick={() => navigate('/orders')}>
                        Quản lý đơn hàng
                    </Button>,
                    <Button key="home" onClick={() => navigate('/')}>
                        Về Trang Chủ
                    </Button>,
                ]}
            />
        </div>
    );
};

export default VNPayReturn;
