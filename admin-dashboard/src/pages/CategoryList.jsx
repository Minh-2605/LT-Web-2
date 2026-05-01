import { Table, Button, Space, message, Popconfirm, Input, Modal, Form, Typography } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const { Title } = Typography;

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    // 1. Lấy danh sách danh mục
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

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // 2. Xử lý Lưu (Thêm/Sửa)
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

    // 3. Xử lý Xóa
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
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: 'Tên danh mục', dataIndex: 'categoryName', key: 'categoryName' },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => {
                        setEditingCategory(record);
                        form.setFieldsValue(record);
                        setIsModalOpen(true);
                    }}>Sửa</Button>
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3} style={{ margin: 0 }}>Quản lý Danh mục</Title>
                <Button type="primary" onClick={() => {
                    setEditingCategory(null);
                    form.resetFields();
                    setIsModalOpen(true);
                }}>
                    Thêm danh mục mới
                </Button>
            </div>

            <Table
                dataSource={categories}
                columns={columns}
                loading={loading}
                rowKey="id"
            />

            <Modal
                title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} onFinish={handleSave} layout="vertical">
                    <Form.Item
                        name="categoryName"
                        label="Tên danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input placeholder="Ví dụ: Điện thoại, Sách, Quần áo..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryList;