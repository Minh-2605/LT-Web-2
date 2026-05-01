import React from 'react';
import { Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';

const ProtectedRoute = ({ children, allowedRoleId }) => {
    const userStr = localStorage.getItem('user');

    // Nếu chưa đăng nhập -> Chuyển về trang đăng nhập
    if (!userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        
        // Kiểm tra role
        if (user.role && user.role.id === allowedRoleId) {
            return children;
        } else {
            // Không đủ quyền -> Hiển thị lỗi 403
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
                    <Result
                        status="403"
                        title="403 Forbidden"
                        subTitle="Xin lỗi, bạn không có quyền truy cập vào trang Quản trị này."
                        extra={<Button type="primary" href="/">Quay lại Trang Chủ</Button>}
                    />
                </div>
            );
        }
    } catch (e) {
        // Dữ liệu lỗi -> Yêu cầu đăng nhập lại
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
