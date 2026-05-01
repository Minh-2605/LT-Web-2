import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Input, Select, Typography, Spin, Empty, Carousel } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';

const { Title, Text } = Typography;
const { Meta } = Card;

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [priceRange, setPriceRange] = useState([0, 100000000]); // Max 100tr
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

        if (searchQuery) {
            result = result.filter(p => 
                p.productName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory !== 'ALL') {
            result = result.filter(p => p.category?.categoryName === selectedCategory);
        }

        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        setFilteredProducts(result);
    }, [products, searchQuery, selectedCategory, priceRange]);

    const handleCategoryClick = (catName) => {
        setSelectedCategory(catName);
    };

    return (
        <div>
            {/* Hero Banner */}
            {!searchQuery && (
                <div style={{ marginBottom: 40, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <Carousel autoplay effect="fade">
                        <div>
                            <div style={{ height: 400, background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)', display: 'flex', alignItems: 'center', padding: '0 80px' }}>
                                <div style={{ color: '#fff', maxWidth: 600 }}>
                                    <Title style={{ color: '#fff', fontSize: 48, fontWeight: 800, marginBottom: 16 }}>Khám Phá Bộ Sưu Tập Mới</Title>
                                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, display: 'block', marginBottom: 32 }}>
                                        Nâng tầm phong cách sống với những sản phẩm công nghệ hiện đại nhất. Giảm giá lên đến 30% cho khách hàng mới.
                                    </Text>
                                    <Button type="primary" size="large" shape="round" style={{ height: 48, padding: '0 32px', fontSize: 16, fontWeight: 600, background: '#fff', color: '#1890ff' }}>
                                        Mua Ngay
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{ height: 400, background: 'linear-gradient(135deg, #ff4d4f 0%, #a8071a 100%)', display: 'flex', alignItems: 'center', padding: '0 80px' }}>
                                <div style={{ color: '#fff', maxWidth: 600 }}>
                                    <Title style={{ color: '#fff', fontSize: 48, fontWeight: 800, marginBottom: 16 }}>Ưu Đãi Đặc Biệt</Title>
                                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, display: 'block', marginBottom: 32 }}>
                                        Cơ hội vàng để sở hữu những món đồ yêu thích với giá cực sốc. Nhanh tay số lượng có hạn!
                                    </Text>
                                    <Button type="primary" size="large" shape="round" style={{ height: 48, padding: '0 32px', fontSize: 16, fontWeight: 600, background: '#fff', color: '#ff4d4f' }}>
                                        Xem Chi Tiết
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Carousel>
                </div>
            )}

            <Row gutter={[32, 32]}>
                {/* Cột trái: Bộ lọc */}
                <Col span={6}>
                    <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        <Title level={4} style={{ marginBottom: 20 }}>Danh mục sản phẩm</Title>
                        <div style={{ marginBottom: 32 }}>
                            <Select 
                                value={selectedCategory} 
                                style={{ width: '100%' }} 
                                onChange={handleCategoryClick}
                                size="large"
                            >
                                <Select.Option value="ALL">Tất cả danh mục</Select.Option>
                                {categories.map(cat => (
                                    <Select.Option key={cat.id} value={cat.categoryName}>
                                        {cat.categoryName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        <Title level={4} style={{ marginBottom: 20 }}>Khoảng giá</Title>
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
                            <Select.Option value="[1000000, 5000000]">Từ 1 - 5 triệu</Select.Option>
                            <Select.Option value="[5000000, 10000000]">Từ 5 - 10 triệu</Select.Option>
                            <Select.Option value="[10000000, 20000000]">Từ 10 - 20 triệu</Select.Option>
                            <Select.Option value="[20000000, 100000000]">Trên 20 triệu</Select.Option>
                        </Select>
                    </div>
                </Col>

                {/* Cột phải: Danh sách sản phẩm */}
                <Col span={18}>
                    <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                            {searchQuery ? `Kết quả tìm kiếm cho: "${searchQuery}"` : 'Sản phẩm nổi bật'}
                        </Title>
                        <Input 
                            placeholder="Tìm kiếm..." 
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: 250, borderRadius: 20 }}
                        />
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>
                    ) : filteredProducts.length === 0 ? (
                        <Empty description="Không tìm thấy sản phẩm nào phù hợp" style={{ padding: '100px 0' }} />
                    ) : (
                        <Row gutter={[24, 24]}>
                            {filteredProducts.map(product => (
                                <Col span={8} key={product.id}>
                                    <Card
                                        hoverable
                                        bordered={false}
                                        style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                                        cover={
                                            product.image ? (
                                                <img alt={product.productName} src={product.image} style={{ height: 220, objectFit: 'cover', width: '100%' }} />
                                            ) : (
                                                <div style={{ height: 220, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfbfbf', fontSize: 18 }}>Ảnh SP</div>
                                            )
                                        }
                                        onClick={() => navigate(`/product/${product.id || product.productId}`)}
                                        bodyStyle={{ padding: '20px' }}
                                    >
                                        <Meta 
                                            title={<span style={{ fontSize: 16, fontWeight: 600 }}>{product.productName}</span>} 
                                            description={
                                                <div style={{ marginTop: 12 }}>
                                                    <Text strong type="danger" style={{ fontSize: 18 }}>
                                                        {product.price?.toLocaleString()} ₫
                                                    </Text>
                                                </div>
                                            } 
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Home;
