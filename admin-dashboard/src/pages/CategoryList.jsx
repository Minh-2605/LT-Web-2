import { Table, Button, Space, message, Popconfirm, Modal, Form, Input, Typography, Tag } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const CATEGORY_ICONS = ['📱', '💻', '👕', '📚', '🏠', '⚽', '🎮', '💄', '🍔', '🎵'];

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8367/categories');
            setCategories(res.data);
        } catch {
            message.error("Không thể tải danh sách danh mục!");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const handleSave = async (values) => {
        try {
            if (editingCategory) {
                await axios.put(`http://localhost:8367/categories/${editingCategory.id}`, values);
                message.success("Cập nhật danh mục thành công!");
            } else {
                await axios.post('http://localhost:8367/categories', values);
                message.success("Thêm danh mục mới thành công!");
            }
            setIsModalOpen(false);
            form.resetFields();
            fetchCategories();
        } catch {
            message.error("Thao tác thất bại!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8367/categories/${id}`);
            message.success("Đã xóa danh mục!");
            fetchCategories();
        } catch {
            message.error("Không thể xóa! Danh mục này có thể đang chứa sản phẩm.");
        }
    };

    const columns = [
        {
            title: 'ID', dataIndex: 'id', key: 'id', width: 80,
            render: (id) => <Text strong style={{ color: '#1677ff' }}>{id}</Text>
        },
        {
            title: 'Danh mục', dataIndex: 'categoryName', key: 'categoryName',
            render: (name, _, index) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40, height: 40,
                        background: 'linear-gradient(135deg, #e6f4ff, #bae0ff)',
                        borderRadius: 10, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 18, border: '1px solid #91caff'
                    }}>
                        {CATEGORY_ICONS[index % CATEGORY_ICONS.length]}
                    </div>
                    <Text strong style={{ fontSize: 15, color: '#1a1a2e' }}>{name}</Text>
                </div>
            )
        },
        {
            title: 'Thao tác', key: 'action', width: 160,
            render: (_, record) => (
                <Space>
                    <Button type="primary" size="small" icon={<EditOutlined />}
                        style={{ borderRadius: 8, height: 32 }}
                        onClick={() => { setEditingCategory(record); form.setFieldsValue(record); setIsModalOpen(true); }}>
                        Sửa
                    </Button>
                    <Popconfirm title="Xác nhận xóa danh mục?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                        <Button danger size="small" icon={<DeleteOutlined />} style={{ borderRadius: 8, height: 32 }}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                        <AppstoreOutlined style={{ color: '#1677ff', marginRight: 10 }} />Quản lý Danh mục
                    </Title>
                    <Text style={{ color: '#6b7280' }}>{categories.length} danh mục</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />}
                    onClick={() => { setEditingCategory(null); form.resetFields(); setIsModalOpen(true); }}
                    style={{ height: 40, borderRadius: 10, fontWeight: 600 }}>
                    Thêm danh mục
                </Button>
            </div>

            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f0fe', overflow: 'hidden', boxShadow: '0 2px 12px rgba(22,119,255,0.05)' }}>
                <Table dataSource={categories} columns={columns} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />
            </div>

            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AppstoreOutlined style={{ color: '#1677ff' }} />
                        <span style={{ fontWeight: 700 }}>{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</span>
                    </div>
                }
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu" cancelText="Hủy"
                centered
                okButtonProps={{ style: { borderRadius: 8, fontWeight: 600 } }}
            >
                <Form form={form} onFinish={handleSave} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="categoryName" label={<Text strong>Tên danh mục</Text>}
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}>
                        <Input placeholder="VD: Điện thoại, Sách, Quần áo..." size="large" style={{ borderRadius: 10 }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryList;