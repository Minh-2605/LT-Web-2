import { useEffect, useState } from 'react';
import { Row, Col, Typography, Button, InputNumber, Divider, message, Spin, Tag, Badge } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined, SafetyCertificateOutlined, CarOutlined, StarFilled, CheckCircleFilled } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { cartApi } from '../../api/cartApi';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productApi.getById(id);
                setProduct(res.data || res);
            } catch (error) {
                message.error("Không thể tải thông tin sản phẩm!");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await cartApi.addItem(id, quantity);
            setAddedSuccess(true);
            message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
            window.dispatchEvent(new Event('cartUpdated'));
            setTimeout(() => setAddedSuccess(false), 2000);
        } catch (error) {
            message.error("Thêm vào giỏ hàng thất bại!");
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 120 }}>
                <Spin size="large" tip="Đang tải sản phẩm..." />
            </div>
        );
    }

    if (!product) return null;

    const inStock = product.availability > 0;

    return (
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(22,119,255,0.08)', border: '1px solid #e8f0fe' }}>
            {/* Breadcrumb */}
            <div style={{ padding: '16px 40px', borderBottom: '1px solid #f0f5ff', background: '#fafcff' }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ color: '#1677ff', fontWeight: 600, fontSize: 14, padding: 0 }}
                >
                    Quay lại
                </Button>
            </div>

            <div style={{ padding: '40px 48px' }}>
                <Row gutter={[56, 48]}>
                    {/* Ảnh sản phẩm */}
                    <Col span={11}>
                        <div style={{
                            borderRadius: 18, overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(22,119,255,0.12)',
                            border: '1px solid #e8f0fe',
                            position: 'relative'
                        }}>
                            {inStock && (
                                <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2, background: 'linear-gradient(135deg, #52c41a, #389e0d)', color: '#fff', padding: '5px 14px', borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
                                    Còn hàng
                                </div>
                            )}
                            {product.image ? (
                                <img
                                    alt={product.productName}
                                    src={product.image}
                                    style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }}
                                />
                            ) : (
                                <div style={{ height: 480, background: 'linear-gradient(135deg, #f0f7ff, #e8f0fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
                                    🛍️
                                </div>
                            )}
                        </div>
                    </Col>

                    {/* Thông tin sản phẩm */}
                    <Col span={13}>
                        {/* Category tag */}
                        {product.category?.categoryName && (
                            <Tag style={{ background: '#e6f4ff', color: '#1677ff', border: '1px solid #91caff', borderRadius: 6, fontWeight: 600, marginBottom: 12 }}>
                                {product.category.categoryName}
                            </Tag>
                        )}

                        <Title level={1} style={{ fontSize: 32, fontWeight: 900, color: '#1a1a2e', lineHeight: 1.25, marginBottom: 12, marginTop: 4 }}>
                            {product.productName}
                        </Title>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                            {[1,2,3,4,5].map(s => <StarFilled key={s} style={{ color: '#faad14', fontSize: 16 }} />)}
                            <Text style={{ color: '#6b7280', fontSize: 14 }}>(4.9) · 128 đánh giá</Text>
                        </div>

                        {/* Giá */}
                        <div style={{
                            padding: '20px 24px',
                            background: 'linear-gradient(135deg, #fff7f7, #fff)',
                            borderRadius: 14,
                            border: '2px solid #ffd6d6',
                            marginBottom: 28
                        }}>
                            <Text style={{ color: '#6b7280', fontSize: 14, display: 'block', marginBottom: 4 }}>Giá bán</Text>
                            <Text style={{ fontSize: 42, fontWeight: 900, color: '#f5222d', fontFamily: 'Inter', lineHeight: 1 }}>
                                {product.price?.toLocaleString()} ₫
                            </Text>
                        </div>

                        {/* Badges */}
                        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                            {[
                                { icon: <SafetyCertificateOutlined />, text: 'Chính hãng 100%', color: '#1677ff' },
                                { icon: <CarOutlined />, text: 'Giao hàng miễn phí', color: '#52c41a' },
                                { icon: <CheckCircleFilled />, text: 'Bảo hành 12 tháng', color: '#722ed1' },
                            ].map((b, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '7px 14px',
                                    background: '#f8faff',
                                    border: `1px solid ${b.color}22`,
                                    borderRadius: 8,
                                    color: b.color, fontSize: 13, fontWeight: 600
                                }}>
                                    {b.icon} {b.text}
                                </div>
                            ))}
                        </div>

                        {/* Mô tả */}
                        <div style={{ marginBottom: 28 }}>
                            <Text strong style={{ fontSize: 15, color: '#374151', display: 'block', marginBottom: 8 }}>Mô tả sản phẩm</Text>
                            <Paragraph style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, margin: 0 }}>
                                {product.discription || "Sản phẩm chất lượng cao, thiết kế tinh tế, mang lại trải nghiệm tuyệt vời cho người dùng."}
                            </Paragraph>
                        </div>

                        <Divider style={{ margin: '24px 0', borderColor: '#e8f0fe' }} />

                        {/* Số lượng */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                            <Text strong style={{ fontSize: 16, minWidth: 80 }}>Số lượng</Text>
                            <InputNumber
                                min={1}
                                max={inStock ? product.availability : 1}
                                value={quantity}
                                onChange={setQuantity}
                                size="large"
                                disabled={!inStock}
                                style={{ width: 110, borderRadius: 10 }}
                            />
                            <Text style={{ color: inStock ? '#52c41a' : '#ff4d4f', fontSize: 14, fontWeight: 600 }}>
                                {inStock ? `Còn ${product.availability} sản phẩm` : 'Tạm hết hàng'}
                            </Text>
                        </div>

                        {/* Nút thêm vào giỏ */}
                        <Button
                            type="primary"
                            size="large"
                            icon={addedSuccess ? <CheckCircleFilled /> : <ShoppingCartOutlined />}
                            onClick={handleAddToCart}
                            loading={adding}
                            disabled={!inStock}
                            style={{
                                width: '100%',
                                height: 58,
                                fontSize: 18,
                                fontWeight: 700,
                                borderRadius: 14,
                                background: !inStock ? '#d9d9d9' : addedSuccess ? 'linear-gradient(135deg, #52c41a, #389e0d)' : 'linear-gradient(135deg, #1677ff, #0050b3)',
                                border: 'none',
                                boxShadow: inStock ? '0 6px 20px rgba(22,119,255,0.35)' : 'none',
                                transition: 'all 0.3s'
                            }}
                        >
                            {!inStock ? 'Tạm hết hàng' : addedSuccess ? '✓ Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ProductDetail;
