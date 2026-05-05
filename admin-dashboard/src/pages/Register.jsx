import React from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { userApi } from '../api/userApi';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const formattedData = {
            userName: values.userName,
            userPassword: values.userPassword,
            active: 1,
            role: { id: 2 },
            userDetails: {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNumber: values.phoneNumber
            }
        };

        try {
            await userApi.register(formattedData);
            message.success('Đăng ký thành công!');
            navigate('/login');
        } catch {
            message.error('Đăng ký thất bại, tên đăng nhập hoặc email có thể đã tồn tại.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1677ff 0%, #0050b3 50%, #003a8c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: -80, left: -80, width: 350, height: 350, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -100, right: -60, width: 450, height: 450, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

            <div style={{
                background: 'rgba(255,255,255,0.97)',
                borderRadius: 24,
                padding: '48px 40px',
                width: '100%',
                maxWidth: 520,
                boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{
                        width: 64, height: 64,
                        background: 'linear-gradient(135deg, #1677ff, #0050b3)',
                        borderRadius: 16,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                        boxShadow: '0 8px 24px rgba(22,119,255,0.35)'
                    }}>
                        <span style={{ fontSize: 28 }}>✨</span>
                    </div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1a1a2e' }}>
                        Tạo Tài Khoản
                    </h1>
                    <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 14 }}>
                        Đăng ký để trải nghiệm mua sắm tuyệt vời
                    </p>
                </div>

                <Form layout="vertical" onFinish={onFinish} size="large">
                    <Form.Item name="userName" label={<span style={{ fontWeight: 600 }}>Tên đăng nhập</span>} rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
                        <Input
                            prefix={<UserOutlined style={{ color: '#1677ff' }} />}
                            placeholder="Nhập tên đăng nhập..."
                            style={{ height: 46, borderRadius: 10 }}
                        />
                    </Form.Item>

                    <Form.Item name="userPassword" label={<span style={{ fontWeight: 600 }}>Mật khẩu</span>} rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#1677ff' }} />}
                            placeholder="Nhập mật khẩu..."
                            style={{ height: 46, borderRadius: 10 }}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="lastName" label={<span style={{ fontWeight: 600 }}>Họ</span>} rules={[{ required: true, message: 'Vui lòng nhập Họ!' }]}>
                                <Input
                                    prefix={<IdcardOutlined style={{ color: '#1677ff' }} />}
                                    placeholder="Họ..."
                                    style={{ height: 46, borderRadius: 10 }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="firstName" label={<span style={{ fontWeight: 600 }}>Tên</span>} rules={[{ required: true, message: 'Vui lòng nhập Tên!' }]}>
                                <Input
                                    placeholder="Tên..."
                                    style={{ height: 46, borderRadius: 10 }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="email" label={<span style={{ fontWeight: 600 }}>Email</span>} rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
                        <Input
                            prefix={<MailOutlined style={{ color: '#1677ff' }} />}
                            placeholder="email@example.com"
                            style={{ height: 46, borderRadius: 10 }}
                        />
                    </Form.Item>

                    <Form.Item name="phoneNumber" label={<span style={{ fontWeight: 600 }}>Số điện thoại</span>}>
                        <Input
                            prefix={<PhoneOutlined style={{ color: '#1677ff' }} />}
                            placeholder="09xxxxxxxxx"
                            style={{ height: 46, borderRadius: 10 }}
                        />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block
                        style={{ height: 50, borderRadius: 10, fontSize: 16, fontWeight: 700, marginTop: 8 }}>
                        Đăng Ký Ngay
                    </Button>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 24, color: '#6b7280', fontSize: 14 }}>
                    Đã có tài khoản?{' '}
                    <a href="/login" style={{ color: '#1677ff', fontWeight: 600 }}>Đăng nhập</a>
                </div>
            </div>
        </div>
    );
};

export default Register;