import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { userApi } from '../api/userApi';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        // Chuyển đổi dữ liệu phẳng từ Form thành cấu trúc lồng nhau cho Backend
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Card title="ĐĂNG KÝ TÀI KHOẢN" style={{ width: 450 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Tên đăng nhập" name="userName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="userPassword" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Item label="Họ" name="firstName" style={{ flex: 1 }} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Tên" name="lastName" style={{ flex: 1 }} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phoneNumber">
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>Đăng ký</Button>
                    <div style={{ marginTop: 10, textAlign: 'center' }}>
                        Đã có tài khoản? <a href="/login">Đăng nhập</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;