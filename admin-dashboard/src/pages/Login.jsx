import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi'; // Import userApi đã gộp login

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Gọi API thật từ Backend
            const res = await userApi.login({
                userName: values.username,    // Phải khớp với biến trong Entity User.java
                userPassword: values.password
            });

            if (res.status === 200) {
                message.success('Chào mừng quay trở lại!');

                // Lưu thông tin User trả về (bao gồm cả ID và Role) vào localStorage
                localStorage.setItem('user', JSON.stringify(res.data));

                // Phân quyền: role id=1 là Admin
                if (res.data?.role?.id === 1) {
                    navigate('/admin/products');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            if (error.response?.status === 401) {
                message.error('Sai tài khoản hoặc mật khẩu!');
            } else if (error.response?.status === 403) {
                message.error('Tài khoản đã bị khóa!');
            } else {
                message.error('Không thể kết nối đến hệ thống (Kiểm tra Gateway/Backend)!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f0f2f5'
        }}>
            <Card title="ĐĂNG NHẬP HỆ THỐNG" style={{ width: 380, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
                    >
                        <Input placeholder="Nhập username..." />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu..." />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                    >
                        Đăng nhập
                    </Button>

                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;