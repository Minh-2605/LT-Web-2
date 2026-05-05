import { Table, Tag, Typography, Avatar, Input } from 'antd';
import { useEffect, useState } from 'react';
import { userApi } from '../api/userApi';
import { SearchOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await userApi.getAll();
            setUsers(res.data || []);
            setFiltered(res.data || []);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        setFiltered(search ? users.filter(u =>
            u.userName?.toLowerCase().includes(search.toLowerCase()) ||
            u.userDetails?.email?.toLowerCase().includes(search.toLowerCase())
        ) : users);
    }, [search, users]);

    const columns = [
        {
            title: 'Người dùng', key: 'user',
            render: (_, record) => {
                const name = `${record.userDetails?.firstName || ''} ${record.userDetails?.lastName || ''}`.trim() || record.userName;
                const initial = name[0]?.toUpperCase() || '?';
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar style={{ background: 'linear-gradient(135deg, #1677ff, #0050b3)', fontWeight: 700 }}>{initial}</Avatar>
                        <div>
                            <Text strong style={{ display: 'block', color: '#1a1a2e' }}>{name}</Text>
                            <Text style={{ color: '#6b7280', fontSize: 13 }}>@{record.userName}</Text>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'Email', dataIndex: ['userDetails', 'email'], key: 'email',
            render: (email) => <Text style={{ color: '#6b7280' }}>{email || '—'}</Text>
        },
        {
            title: 'Điện thoại', dataIndex: ['userDetails', 'phoneNumber'], key: 'phone',
            render: (phone) => <Text>{phone || '—'}</Text>
        },
        {
            title: 'Vai trò', dataIndex: ['role', 'roleName'], key: 'role',
            render: (role) => (
                <Tag style={{
                    background: role === 'ROLE_ADMIN' ? '#fff7e6' : '#e6f4ff',
                    color: role === 'ROLE_ADMIN' ? '#d48806' : '#1677ff',
                    border: role === 'ROLE_ADMIN' ? '1px solid #ffd591' : '1px solid #91caff',
                    borderRadius: 6, fontWeight: 700
                }}>
                    {role === 'ROLE_ADMIN' ? '👑 Admin' : '👤 Khách hàng'}
                </Tag>
            )
        },
        {
            title: 'Trạng thái', dataIndex: 'active',
            render: (active) => (
                <Tag style={{
                    background: active === 1 ? '#f6ffed' : '#fff1f0',
                    color: active === 1 ? '#52c41a' : '#ff4d4f',
                    border: active === 1 ? '1px solid #b7eb8f' : '1px solid #ffa39e',
                    borderRadius: 6, fontWeight: 700
                }}>
                    {active === 1 ? '● Hoạt động' : '● Bị khóa'}
                </Tag>
            )
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                        <TeamOutlined style={{ color: '#1677ff', marginRight: 10 }} />Quản lý Người dùng
                    </Title>
                    <Text style={{ color: '#6b7280' }}>{filtered.length} tài khoản</Text>
                </div>
                <Input
                    prefix={<SearchOutlined style={{ color: '#1677ff' }} />}
                    placeholder="Tìm theo tên hoặc email..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: 260, borderRadius: 10, height: 40 }}
                    allowClear
                />
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f0fe', overflow: 'hidden', boxShadow: '0 2px 12px rgba(22,119,255,0.05)' }}>
                <Table dataSource={filtered} columns={columns} rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: false }} />
            </div>
        </div>
    );
};

export default UserList;