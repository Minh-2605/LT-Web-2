import { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, message, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/userApi';

const { Title, Text } = Typography;

const Profile = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) { message.warning("Bạn cần đăng nhập!"); navigate('/login'); return; }
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (parsedUser.userDetails) {
            form.setFieldsValue(parsedUser.userDetails);
        }
    }, [form, navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await userApi.updateDetails(user.id, values);
            if (res.status === 200) {
                message.success('Cập nhật thông tin thành công!');
                localStorage.setItem('user', JSON.stringify(res.data));
                setUser(res.data);
            }
        } catch {
            message.error('Không thể cập nhật thông tin!');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

    const initials = `${user.userDetails?.firstName?.[0] || ''}${user.userDetails?.lastName?.[0] || user.userName?.[0] || '?'}`.toUpperCase();

    return (
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
            {/* Profile Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1677ff 0%, #003a8c 100%)',
                borderRadius: 20, padding: '32px 40px',
                marginBottom: 24, position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative' }}>
                    <div style={{
                        width: 80, height: 80,
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 30, fontWeight: 800, color: '#fff',
                        border: '3px solid rgba(255,255,255,0.4)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        {initials}
                    </div>
                    <div>
                        <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>
                            {user.userDetails?.firstName} {user.userDetails?.lastName || user.userName}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>
                            @{user.userName} · {user.userDetails?.email || 'Chưa có email'}
                        </Text>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8f0fe', overflow: 'hidden', boxShadow: '0 4px 20px rgba(22,119,255,0.06)' }}>
                <div style={{ padding: '20px 32px', borderBottom: '1px solid #e8f0fe', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <EditOutlined style={{ color: '#1677ff', fontSize: 18 }} />
                    <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Chỉnh sửa thông tin</Title>
                </div>

                <Form form={form} layout="vertical" onFinish={onFinish} size="large" style={{ padding: '28px 32px' }}>
                    {/* Thông tin cá nhân */}
                    <div style={{ background: '#f8faff', borderRadius: 14, padding: '20px 24px', marginBottom: 24, border: '1px solid #e8f0fe' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                            <UserOutlined style={{ color: '#1677ff', fontSize: 16 }} />
                            <Text strong style={{ color: '#1677ff', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Thông tin cá nhân</Text>
                        </div>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item label={<Text strong>Họ</Text>} name="lastName" rules={[{ required: true }]}>
                                    <Input placeholder="Họ..." style={{ height: 44, borderRadius: 10 }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<Text strong>Tên</Text>} name="firstName" rules={[{ required: true }]}>
                                    <Input placeholder="Tên..." style={{ height: 44, borderRadius: 10 }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<Text strong>Email</Text>} name="email" rules={[{ required: true, type: 'email' }]}>
                                    <Input prefix={<MailOutlined style={{ color: '#1677ff' }} />} placeholder="email@example.com" style={{ height: 44, borderRadius: 10 }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<Text strong>Số điện thoại</Text>} name="phoneNumber">
                                    <Input prefix={<PhoneOutlined style={{ color: '#1677ff' }} />} placeholder="09xxxxxxxxx" style={{ height: 44, borderRadius: 10 }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* Địa chỉ */}
                    <div style={{ background: '#f8faff', borderRadius: 14, padding: '20px 24px', marginBottom: 28, border: '1px solid #e8f0fe' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                            <HomeOutlined style={{ color: '#1677ff', fontSize: 16 }} />
                            <Text strong style={{ color: '#1677ff', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Địa chỉ nhận hàng</Text>
                        </div>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item label={<Text strong>Đường</Text>} name="street">
                                    <Input placeholder="Tên đường..." style={{ height: 44, borderRadius: 10 }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={<Text strong>Số nhà</Text>} name="streetNumber">
                                    <Input placeholder="Số nhà..." style={{ height: 44, borderRadius: 10 }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label={<Text strong>Phường/Xã</Text>} name="locality">
                                    <Input placeholder="Phường/Xã..." style={{ height: 44, borderRadius: 10 }} />
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item label={<Text strong>Tỉnh/Thành phố</Text>} name="country">
                                    <Input placeholder="Thành phố..." style={{ height: 44, borderRadius: 10 }} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label={<Text strong>Mã bưu điện</Text>} name="zipCode">
                                    <Input placeholder="700000" style={{ height: 44, borderRadius: 10 }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" htmlType="submit" size="large" loading={loading}
                            icon={<SaveOutlined />}
                            style={{ height: 48, borderRadius: 12, fontWeight: 700, padding: '0 32px' }}>
                            Lưu Thay Đổi
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Profile;
