import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Typography, Row, Col, Divider } from 'antd';
import { PictureOutlined, TagOutlined, DollarOutlined, DatabaseOutlined, FileTextOutlined } from '@ant-design/icons';
import { categoryApi } from '../api/categoryApi';

const { Text } = Typography;

const ProductModal = ({ open, onCreate, onCancel, initialValues }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (open) {
            const fetchCategories = async () => {
                try {
                    const res = await categoryApi.getAll();
                    setCategories(res.data);
                } catch (error) {
                    console.error("Lỗi lấy danh mục:", error);
                }
            };
            fetchCategories();
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
                setPreviewImage(initialValues.image);
            } else {
                form.resetFields();
                form.setFieldsValue({ availability: 10 });
                setPreviewImage(null);
            }
        }
    }, [open, initialValues, form]);

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });

    const isEditing = !!initialValues?.id;

    return (
        <Modal
            open={open}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #1677ff, #0050b3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontSize: 16 }}>{isEditing ? '✏️' : '+'}</span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 17 }}>{isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</span>
                </div>
            }
            okText={isEditing ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
            onCancel={onCancel}
            width={640}
            centered
            okButtonProps={{ style: { borderRadius: 8, height: 40, fontWeight: 600 } }}
            cancelButtonProps={{ style: { borderRadius: 8, height: 40 } }}
            onOk={() => {
                form.validateFields()
                    .then((values) => { onCreate(values); })
                    .catch((info) => console.log('Validate Failed:', info));
            }}
        >
            <Form form={form} layout="vertical" name="product_form" style={{ marginTop: 16 }}>
                {/* Upload ảnh */}
                <div style={{ background: '#f8faff', borderRadius: 14, padding: '20px', marginBottom: 20, border: '1px dashed #91caff', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center', flexDirection: previewImage ? 'row' : 'column' }}>
                        {previewImage ? (
                            <img src={previewImage} alt="preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: '2px solid #91caff', boxShadow: '0 4px 12px rgba(22,119,255,0.15)' }} />
                        ) : (
                            <div style={{ color: '#1677ff', fontSize: 40, marginBottom: 8 }}>
                                <PictureOutlined />
                            </div>
                        )}
                        <div>
                            <Text strong style={{ display: 'block', color: '#1a1a2e', marginBottom: 6 }}>
                                {previewImage ? 'Ảnh đã chọn' : 'Tải ảnh sản phẩm'}
                            </Text>
                            <label style={{
                                cursor: 'pointer',
                                background: 'linear-gradient(135deg, #1677ff, #0050b3)',
                                color: '#fff',
                                padding: '8px 18px',
                                borderRadius: 8, fontWeight: 600, fontSize: 13,
                                display: 'inline-block',
                                boxShadow: '0 3px 10px rgba(22,119,255,0.3)'
                            }}>
                                📂 Chọn ảnh
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const base64 = await getBase64(file);
                                            form.setFieldsValue({ image: base64 });
                                            setPreviewImage(base64);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <Form.Item name="image" hidden><Input /></Form.Item>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="productName"
                            label={<Text strong><TagOutlined style={{ color: '#1677ff', marginRight: 6 }} />Tên sản phẩm</Text>}
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                        >
                            <Input placeholder="VD: iPhone 15 Pro Max 256GB" size="large" style={{ borderRadius: 10 }} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            name="discription"
                            label={<Text strong><FileTextOutlined style={{ color: '#1677ff', marginRight: 6 }} />Mô tả</Text>}
                        >
                            <Input.TextArea rows={3} placeholder="Mô tả chi tiết sản phẩm..." style={{ borderRadius: 10 }} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label={<Text strong><TagOutlined style={{ color: '#1677ff', marginRight: 6 }} />Danh mục</Text>}
                            name={['category', 'id']}
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select placeholder="Chọn danh mục..." size="large" style={{ borderRadius: 10 }}>
                                {categories.map(cat => (
                                    <Select.Option key={cat.id} value={cat.id}>{cat.categoryName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="price"
                            label={<Text strong><DollarOutlined style={{ color: '#1677ff', marginRight: 6 }} />Giá bán (VNĐ)</Text>}
                            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                        >
                            <InputNumber
                                style={{ width: '100%', borderRadius: 10 }}
                                size="large"
                                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(v) => v.replace(/,*/g, '')}
                                placeholder="0"
                                addonAfter="₫"
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="availability"
                            label={<Text strong><DatabaseOutlined style={{ color: '#1677ff', marginRight: 6 }} />Số lượng tồn kho</Text>}
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%', borderRadius: 10 }} size="large" placeholder="0" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ProductModal;