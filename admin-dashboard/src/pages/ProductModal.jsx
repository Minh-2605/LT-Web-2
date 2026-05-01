import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { categoryApi } from '../api/categoryApi';

const ProductModal = ({ open, onCreate, onCancel, initialValues }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]); // Thêm state để lưu danh mục

    const [previewImage, setPreviewImage] = useState(null);

    // 1. Lấy danh sách danh mục từ Backend khi mở Modal
    useEffect(() => {
        if (open) {
            const fetchCategories = async () => {
                try {
                    const res = await categoryApi.getAll();
                    setCategories(res.data);
                } catch (error) {
                    console.error("Lỗi lấy danh mục:", error);
                    message.error("Không thể tải danh sách danh mục!");
                }
            };
            fetchCategories();
        }
    }, [open]);

    // 2. Reset form mỗi khi mở Modal (cho mục đích Thêm/Sửa)
    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
                setPreviewImage(initialValues.image);
            } else {
                form.resetFields();
                form.setFieldsValue({ availability: 1 });
                setPreviewImage(null);
            }
        }
    }, [open, initialValues, form]);

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <Modal
            open={open}
            title={initialValues?.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            okText={initialValues?.id ? "Cập nhật" : "Thêm mới"}
            cancelText="Hủy"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        onCreate(values);
                        // Lưu ý: Không resetFields ở đây để tránh mất dữ liệu nếu API lỗi
                    })
                    .catch((info) => console.log('Validate Failed:', info));
            }}
        >
            <Form form={form} layout="vertical" name="product_form">
                <Form.Item label="Hình ảnh sản phẩm">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const base64 = await getBase64(file);
                                form.setFieldsValue({ image: base64 });
                                setPreviewImage(base64); // Cập nhật state để React re-render
                            }
                        }}
                    />
                    {/* Hiển thị ảnh xem trước nếu đã có ảnh */}
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="preview"
                            style={{ width: 100, marginTop: 10, borderRadius: 5 }}
                        />
                    )}
                </Form.Item>

                <Form.Item name="image" hidden>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="productName"
                    label="Tên sản phẩm"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                    <Input placeholder="Ví dụ: iPhone 15 Pro" />
                </Form.Item>

                <Form.Item
                    name="discription"
                    label="Mô tả"
                >
                    <Input.TextArea rows={3} placeholder="Mô tả chi tiết sản phẩm..." />
                </Form.Item>

                <Form.Item
                    label="Danh mục"
                    name={['category', 'id']}
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                    <Select placeholder="Chọn danh mục">
                        {categories.map(cat => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.categoryName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Giá sản phẩm"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        addonAfter="VNĐ"
                    />
                </Form.Item>

                <Form.Item name="availability" label="Trạng thái">
                    <Select>
                        <Select.Option value={1}>Còn hàng</Select.Option>
                        <Select.Option value={0}>Hết hàng</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductModal;