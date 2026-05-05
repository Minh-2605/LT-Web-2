import React, { useState } from 'react';
import { Form, Input, Button, message, Modal, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // State cho Quên mật khẩu
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await userApi.login({
                userName: values.username,
                userPassword: values.password
            });
            if (res.status === 200) {
                message.success('Chào mừng quay trở lại!');
                localStorage.setItem('user', JSON.stringify(res.data));
                if (res.data?.role?.id === 1) {
                    navigate('/admin/products');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            if (error.response?.status === 401) {
                message.error('Sai tài khoản hoặc mật khẩu!');
            } else if (error.response?.status === 403) {
                message.error('Tài khoản đã bị khóa!');
            } else {
                message.error('Không thể kết nối đến hệ thống!');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (values) => {
        setForgotLoading(true);
        try {
            await userApi.forgotPassword(values.email);
            message.success('Mã OTP đã được gửi đến email của bạn!');
            setForgotEmail(values.email);
            setForgotStep(2);
        } catch (error) {
            message.error('Không tìm thấy tài khoản với email này!');
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (values) => {
        setForgotLoading(true);
        try {
            await userApi.resetPassword(forgotEmail, values.otp, values.newPassword);
            message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            setIsForgotModalOpen(false);
            setForgotStep(1);
        } catch (error) {
            message.error(error.response?.data || 'Mã OTP không hợp lệ hoặc đã hết hạn!');
        } finally {
            setForgotLoading(false);
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
            {/* Background decorations */}
            <div style={{
                position: 'absolute', top: -100, right: -100,
                width: 400, height: 400,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute', bottom: -150, left: -80,
                width: 500, height: 500,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '50%'
            }} />

            <div style={{
                background: 'rgba(255,255,255,0.97)',
                borderRadius: 24,
                padding: '48px 40px',
                width: '100%',
                maxWidth: 420,
                boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Logo / Icon */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
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
                        <span style={{ fontSize: 28 }}>🛒</span>
                    </div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                        Đăng Nhập
                    </h1>
                    <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 14 }}>
                        Chào mừng bạn trở lại!
                    </p>
                </div>

                <Form layout="vertical" onFinish={onFinish} size="large">
                    <Form.Item name="username" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
                        <Input
                            prefix={<UserOutlined style={{ color: '#1677ff' }} />}
                            placeholder="Tên đăng nhập"
                            style={{ height: 48, borderRadius: 10, fontSize: 15 }}
                        />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#1677ff' }} />}
                            placeholder="Mật khẩu"
                            style={{ height: 48, borderRadius: 10, fontSize: 15 }}
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, marginTop: -8 }}>
                        <a
                            onClick={() => { setIsForgotModalOpen(true); setForgotStep(1); }}
                            style={{ color: '#1677ff', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}
                        >
                            Quên mật khẩu?
                        </a>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{ height: 50, borderRadius: 10, fontSize: 16, fontWeight: 700, letterSpacing: '0.3px' }}
                    >
                        Đăng Nhập
                    </Button>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 24, color: '#6b7280', fontSize: 14 }}>
                    Chưa có tài khoản?{' '}
                    <a href="/register" style={{ color: '#1677ff', fontWeight: 600 }}>Đăng ký ngay</a>
                </div>
            </div>

            {/* Modal Quên Mật Khẩu */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <SafetyOutlined style={{ color: '#1677ff', fontSize: 20 }} />
                        <span style={{ fontWeight: 700 }}>
                            {forgotStep === 1 ? 'Quên Mật Khẩu' : 'Nhập mã OTP & Mật khẩu mới'}
                        </span>
                    </div>
                }
                open={isForgotModalOpen}
                footer={null}
                onCancel={() => { setIsForgotModalOpen(false); setForgotStep(1); }}
                width={420}
                centered
            >
                {forgotStep === 1 ? (
                    <>
                        <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 14 }}>
                            Nhập địa chỉ email bạn đã đăng ký. Mình sẽ gửi mã OTP (hết hạn sau 5 phút) để đặt lại mật khẩu.
                        </p>
                        <Form layout="vertical" onFinish={handleSendOtp} size="large">
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined style={{ color: '#1677ff' }} />}
                                    placeholder="Email đăng ký..."
                                    style={{ height: 46, borderRadius: 10 }}
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block loading={forgotLoading}
                                style={{ height: 46, borderRadius: 10, fontWeight: 600 }}>
                                Gửi mã OTP
                            </Button>
                        </Form>
                    </>
                ) : (
                    <>
                        <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 14 }}>
                            Mã OTP đã được gửi tới <strong>{forgotEmail}</strong>. Vui lòng kiểm tra hộp thư.
                        </p>
                        <Form layout="vertical" onFinish={handleResetPassword} size="large">
                            <Form.Item name="otp" label="Mã OTP" rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}>
                                <Input
                                    prefix={<SafetyOutlined style={{ color: '#1677ff' }} />}
                                    placeholder="Nhập mã 6 số..."
                                    style={{ height: 46, borderRadius: 10, letterSpacing: 6, textAlign: 'center', fontSize: 20 }}
                                    maxLength={6}
                                />
                            </Form.Item>
                            <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}>
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: '#1677ff' }} />}
                                    placeholder="Nhập mật khẩu mới..."
                                    style={{ height: 46, borderRadius: 10 }}
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block loading={forgotLoading}
                                style={{ height: 46, borderRadius: 10, fontWeight: 600 }}>
                                Đổi Mật Khẩu
                            </Button>
                            <Button type="text" block style={{ marginTop: 8, color: '#6b7280' }}
                                onClick={() => setForgotStep(1)}>
                                ← Dùng email khác
                            </Button>
                        </Form>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Login;