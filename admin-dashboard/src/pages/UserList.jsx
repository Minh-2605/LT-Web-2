import { Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { userApi } from '../api/userApi';

const { Title } = Typography;

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await userApi.getAll();
            setUsers(res.data);
        };
        fetchUsers();
    }, []);

    const columns = [
        { title: 'Username', dataIndex: 'userName', key: 'userName' },
        // Cách lấy dữ liệu từ UserDetails lồng bên trong
        {
            title: 'Họ tên', key: 'fullName', render: (_, record) =>
                `${record.userDetails?.firstName || ''} ${record.userDetails?.lastName || ''}`
        },
        { title: 'Email', dataIndex: ['userDetails', 'email'], key: 'email' },
        { title: 'Số điện thoại', dataIndex: ['userDetails', 'phoneNumber'], key: 'phone' },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            render: (active) => (
                <Tag color={active === 1 ? 'green' : 'red'}>
                    {active === 1 ? 'Đang hoạt động' : 'Bị khóa'}
                </Tag>
            )
        },
        { title: 'Vai trò', dataIndex: ['role', 'roleName'], key: 'role' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3} style={{ margin: 0 }}>Quản lý Người dùng</Title>
            </div>
            <Table dataSource={users} columns={columns} rowKey="id" />
        </div>
    );
};

export default UserList;