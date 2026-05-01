import { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/userApi';

const { Title } = Typography;

const Profile = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            message.warning("Bạn cần đăng nhập để xem trang này!");
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Nạp dữ liệu hiện tại vào form
        if (parsedUser.userDetails) {
            form.setFieldsValue(parsedUser.userDetails);
        } else {
            // Nếu chưa có chi tiết, có thể email nằm ở user (hoặc để trống)
            form.setFieldsValue({
                firstName: '',
                lastName: '',
                email: '',
            });
        }
    }, [form, navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Gọi API cập nhật
            const res = await userApi.updateDetails(user.id, values);
            
            if (res.status === 200) {
                message.success('Cập nhật thông tin thành công!');
                
                // Cập nhật lại localStorage để Layout và các nơi khác nhận dữ liệu mới
                const updatedUser = res.data;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            message.error('Không thể cập nhật thông tin!');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: 48, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Title level={2} style={{ fontWeight: 800 }}>Thông Tin Tài Khoản</Title>
                <Typography.Text type="secondary">Cập nhật thông tin cá nhân và địa chỉ giao hàng của bạn</Typography.Text>
            </div>
            
            <Form 
                form={form} 
                layout="vertical" 
                onFinish={onFinish}
                size="large"
            >
                <div style={{ background: '#fafafa', padding: 24, borderRadius: 12, marginBottom: 32, border: '1px solid #f0f0f0' }}>
                    <Title level={5} style={{ marginBottom: 24 }}><UserOutlined /> Thông tin cá nhân</Title>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="Họ" name="lastName" rules={[{ required: true, message: 'Vui lòng nhập Họ!' }]}>
                                <Input placeholder="Họ..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Tên" name="firstName" rules={[{ required: true, message: 'Vui lòng nhập Tên!' }]}>
                                <Input placeholder="Tên..." />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
                                <Input placeholder="email@example.com" prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Số điện thoại" name="phoneNumber">
                                <Input placeholder="09xxxxxxxxx" prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <div style={{ background: '#fafafa', padding: 24, borderRadius: 12, marginBottom: 40, border: '1px solid #f0f0f0' }}>
                    <Title level={5} style={{ marginBottom: 24 }}><HomeOutlined /> Địa chỉ nhận hàng</Title>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="Đường" name="street">
                                <Input placeholder="Tên đường..." />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Số nhà" name="streetNumber">
                                <Input placeholder="Số nhà..." />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item label="Phường/Xã/Quận" name="locality">
                                <Input placeholder="Phường/Xã..." />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Tỉnh/Thành phố" name="country">
                                <Input placeholder="Thành phố..." />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Mã bưu điện (Zip)" name="zipCode">
                                <Input placeholder="VD: 700000" />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ width: 250, height: 50, fontSize: 16, fontWeight: 600, borderRadius: 25 }}>
                        Lưu Thay Đổi
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Profile;
