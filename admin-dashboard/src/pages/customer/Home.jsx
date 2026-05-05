import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Input, Select, Typography, Spin, Empty, Tag, Badge } from 'antd';
import { SearchOutlined, FireOutlined, ThunderboltOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';

const { Title, Text } = Typography;
const { Meta } = Card;

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const search = queryParams.get('search');
        if (search) setSearchQuery(search);
    }, [location.search]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productRes, categoryRes] = await Promise.all([
                    productApi.getAll(),
                    categoryApi.getAll()
                ]);
                const productData = Array.isArray(productRes.data) ? productRes.data : productRes;
                const categoryData = Array.isArray(categoryRes.data) ? categoryRes.data : categoryRes;
                setProducts(productData);
                setFilteredProducts(productData);
                setCategories(categoryData);
            } catch (error) {
                console.error("Lỗi tải dữ liệu", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let result = products;
        if (searchQuery) result = result.filter(p => p.productName.toLowerCase().includes(searchQuery.toLowerCase()));
        if (selectedCategory !== 'ALL') result = result.filter(p => p.category?.categoryName === selectedCategory);
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
        setFilteredProducts(result);
    }, [products, searchQuery, selectedCategory, priceRange]);

    return (
        <div>
            {/* Hero Banner */}
            {!searchQuery && (
                <div style={{
                    background: 'linear-gradient(135deg, #1677ff 0%, #003a8c 100%)',
                    borderRadius: 20,
                    marginBottom: 32,
                    padding: '56px 64px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 12px 40px rgba(22,119,255,0.25)'
                }}>
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: -80, right: 200, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <FireOutlined style={{ color: '#faad14', fontSize: 18 }} />
                            <Tag style={{ background: 'rgba(250,173,20,0.2)', border: '1px solid rgba(250,173,20,0.4)', color: '#faad14', fontWeight: 600 }}>
                                Ưu đãi đặc biệt
                            </Tag>
                        </div>
                        <h1 style={{ color: '#fff', fontSize: 42, fontWeight: 900, margin: '0 0 12px', lineHeight: 1.2, letterSpacing: '-1px' }}>
                            Khám Phá Thế Giới<br />Mua Sắm Hiện Đại
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 28, lineHeight: 1.6 }}>
                            Hàng ngàn sản phẩm chính hãng, giao hàng nhanh, giá tốt nhất thị trường.
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <Button
                                size="large"
                                style={{
                                    background: '#fff', color: '#1677ff', border: 'none',
                                    height: 48, padding: '0 28px', borderRadius: 10, fontWeight: 700, fontSize: 15,
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                                }}
                                icon={<ThunderboltOutlined />}
                                onClick={() => document.getElementById('product-list')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Mua Ngay
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{
                        position: 'absolute', right: 64, top: '50%', transform: 'translateY(-50%)',
                        display: 'flex', flexDirection: 'column', gap: 16
                    }}>
                        {[
                            { num: products.length + '+', label: 'Sản phẩm' },
                            { num: '100%', label: 'Chính hãng' },
                            { num: 'Free', label: 'Vận chuyển' },
                        ].map((s, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.12)', borderRadius: 12,
                                padding: '12px 20px', textAlign: 'center', backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{s.num}</div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Row gutter={[28, 28]}>
                {/* Sidebar Bộ lọc */}
                <Col span={6}>
                    <div style={{
                        background: '#fff', borderRadius: 16,
                        boxShadow: '0 2px 12px rgba(22,119,255,0.06)',
                        border: '1px solid #e8f0fe',
                        overflow: 'hidden',
                        position: 'sticky', top: 16
                    }}>
                        <div style={{
                            padding: '16px 20px',
                            background: 'linear-gradient(135deg, #1677ff, #0050b3)',
                            color: '#fff'
                        }}>
                            <Title level={5} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>🔍 Bộ lọc</Title>
                        </div>
                        <div style={{ padding: 20 }}>
                            <div style={{ marginBottom: 24 }}>
                                <Text strong style={{ display: 'block', marginBottom: 10, color: '#374151', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Danh mục
                                </Text>
                                <Select
                                    value={selectedCategory}
                                    style={{ width: '100%' }}
                                    onChange={setSelectedCategory}
                                    size="large"
                                >
                                    <Select.Option value="ALL">Tất cả danh mục</Select.Option>
                                    {categories.map(cat => (
                                        <Select.Option key={cat.id} value={cat.categoryName}>{cat.categoryName}</Select.Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Text strong style={{ display: 'block', marginBottom: 10, color: '#374151', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Khoảng giá
                                </Text>
                                <Select
                                    defaultValue="ALL"
                                    style={{ width: '100%' }}
                                    onChange={(val) => {
                                        if (val === 'ALL') setPriceRange([0, 100000000]);
                                        else setPriceRange(JSON.parse(val));
                                    }}
                                    size="large"
                                >
                                    <Select.Option value="ALL">Tất cả mức giá</Select.Option>
                                    <Select.Option value="[0, 1000000]">Dưới 1 triệu</Select.Option>
                                    <Select.Option value="[1000000, 5000000]">1 - 5 triệu</Select.Option>
                                    <Select.Option value="[5000000, 10000000]">5 - 10 triệu</Select.Option>
                                    <Select.Option value="[10000000, 20000000]">10 - 20 triệu</Select.Option>
                                    <Select.Option value="[20000000, 100000000]">Trên 20 triệu</Select.Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Danh sách sản phẩm */}
                <Col span={18}>
                    <div id="product-list">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div>
                                <Title level={3} style={{ margin: 0, fontWeight: 800, color: '#1a1a2e' }}>
                                    {searchQuery ? `Kết quả: "${searchQuery}"` : '🌟 Sản phẩm nổi bật'}
                                </Title>
                                {!loading && (
                                    <Text style={{ color: '#6b7280', fontSize: 14 }}>
                                        {filteredProducts.length} sản phẩm
                                    </Text>
                                )}
                            </div>
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                prefix={<SearchOutlined style={{ color: '#1677ff' }} />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: 260, borderRadius: 10, height: 42 }}
                                allowClear
                            />
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <Spin size="large" tip="Đang tải sản phẩm..." />
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <Empty description="Không tìm thấy sản phẩm nào" style={{ padding: '80px 0' }} />
                        ) : (
                            <Row gutter={[20, 20]}>
                                {filteredProducts.map((product, idx) => (
                                    <Col span={8} key={product.id}>
                                        <div
                                            className="product-card"
                                            style={{
                                                background: '#fff',
                                                borderRadius: 14,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: '1px solid #e8f0fe',
                                                transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                            }}
                                            onClick={() => navigate(`/product/${product.id || product.productId}`)}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.boxShadow = '0 12px 32px rgba(22,119,255,0.18)';
                                                e.currentTarget.style.transform = 'translateY(-6px)';
                                                e.currentTarget.style.borderColor = '#1677ff';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.borderColor = '#e8f0fe';
                                            }}
                                        >
                                            {/* Product Image */}
                                            <div style={{ position: 'relative', overflow: 'hidden', height: 210 }}>
                                                {product.image ? (
                                                    <img
                                                        alt={product.productName}
                                                        src={product.image}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', display: 'block' }}
                                                    />
                                                ) : (
                                                    <div style={{ height: '100%', background: 'linear-gradient(135deg, #f0f7ff, #e8f0fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                                                        🛍️
                                                    </div>
                                                )}
                                                {idx < 3 && (
                                                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'linear-gradient(135deg, #ff4d4f, #cf1322)', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                                                        🔥 HOT
                                                    </div>
                                                )}
                                                {product.availability <= 0 && (
                                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, background: 'rgba(0,0,0,0.6)', padding: '6px 16px', borderRadius: 8 }}>Hết hàng</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div style={{ padding: '16px 18px 18px' }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                                                    <Text strong style={{ fontSize: 15, color: '#1a1a2e', lineHeight: 1.4, flex: 1 }}>
                                                        {product.productName}
                                                    </Text>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <StarFilled key={s} style={{ fontSize: 11, color: '#faad14' }} />
                                                    ))}
                                                    <Text style={{ color: '#6b7280', fontSize: 12, marginLeft: 4 }}>(5.0)</Text>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 20, fontWeight: 800, color: '#f5222d', fontFamily: 'Inter' }}>
                                                        {product.price?.toLocaleString()} ₫
                                                    </Text>
                                                    {product.category?.categoryName && (
                                                        <Tag style={{ background: '#e6f4ff', color: '#1677ff', border: '1px solid #91caff', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                                                            {product.category.categoryName}
                                                        </Tag>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Home;
