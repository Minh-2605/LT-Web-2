import { useEffect, useState } from 'react';
import { Row, Col, Typography, Button, InputNumber, Divider, message, Spin, Tag } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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
            message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
            window.dispatchEvent(new Event('cartUpdated'));
            // Tuỳ chọn: Chuyển hướng tới giỏ hàng ngay lập tức hoặc ở lại
            // navigate('/cart');
        } catch (error) {
            message.error("Thêm vào giỏ hàng thất bại!");
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
    }

    if (!product) return null;

    return (
        <div style={{ background: '#fff', padding: 48, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 32, fontSize: 16, fontWeight: 500 }}>
                Quay lại
            </Button>
            
            <Row gutter={[64, 48]}>
                {/* Cột trái: Ảnh sản phẩm */}
                <Col span={11}>
                    <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                        {product.image ? (
                            <img alt={product.productName} src={product.image} style={{ width: '100%', height: 500, objectFit: 'cover', display: 'block' }} />
                        ) : (
                            <div style={{ height: 500, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfbfbf', fontSize: 24 }}>
                                Ảnh Sản Phẩm
                            </div>
                        )}
                    </div>
                </Col>

                {/* Cột phải: Thông tin */}
                <Col span={13}>
                    <Title level={2} style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>{product.productName}</Title>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px', borderRadius: 4 }}>Chính hãng 100%</Tag>
                        <Tag color="green" style={{ fontSize: 14, padding: '4px 12px', borderRadius: 4 }}>Giao hàng miễn phí</Tag>
                    </div>
                    
                    <div style={{ padding: '24px', background: '#fafafa', borderRadius: 12, marginBottom: 32, border: '1px solid #f0f0f0' }}>
                        <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>Giá bán</Text>
                        <Text type="danger" style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>
                            {product.price?.toLocaleString()} ₫
                        </Text>
                    </div>

                    <Title level={5} style={{ marginBottom: 12 }}>Mô tả sản phẩm</Title>
                    <Paragraph style={{ fontSize: 16, color: '#595959', lineHeight: 1.8, marginBottom: 32 }}>
                        {product.discription || "Chưa có mô tả chi tiết cho sản phẩm này. Sản phẩm mang đến trải nghiệm tuyệt vời, thiết kế tối giản và hiệu năng cao."}
                    </Paragraph>

                    <Divider style={{ margin: '32px 0' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
                        <Text strong style={{ fontSize: 18 }}>Số lượng</Text>
                        <InputNumber 
                            min={1} 
                            max={99} 
                            value={quantity} 
                            onChange={setQuantity} 
                            size="large"
                            style={{ width: 100, borderRadius: 8 }}
                        />
                    </div>

                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />} 
                        onClick={handleAddToCart}
                        loading={adding}
                        shape="round"
                        style={{ width: '100%', height: 60, fontSize: 20, fontWeight: 600, background: 'linear-gradient(90deg, #1890ff 0%, #0050b3 100%)', border: 'none', boxShadow: '0 4px 12px rgba(24,144,255,0.4)' }}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetail;
