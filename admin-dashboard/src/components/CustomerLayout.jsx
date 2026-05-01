import { Layout, Menu, Badge, Input, Dropdown, Avatar, Button, Typography, Space, Row, Col } from 'antd';
import { ShoppingCartOutlined, HomeOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cartApi } from '../api/cartApi';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) { }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const userMenuItems = [
    {
      key: '1',
      label: <span style={{ fontWeight: 'bold' }}>Xin chào, {user?.userName || 'Người dùng'}</span>,
      disabled: true,
    },
    { type: 'divider' },
    {
      key: '2',
      label: 'Trang thông tin',
      onClick: () => navigate('/profile'),
    },
    {
      key: '3',
      label: 'Lịch sử mua hàng',
      onClick: () => navigate('/orders'),
    },
    { type: 'divider' },
    {
      key: '4',
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const fetchCartCount = async () => {
    try {
      const res = await cartApi.getCart();
      const items = Array.isArray(res.data) ? res.data : res;
      const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(count);
    } catch (e) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, []);

  const onSearch = (value) => {
    navigate(`/?search=${value}`);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header style={{
        position: 'sticky', top: 0, zIndex: 1000, width: '100%',
        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 80px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Title level={3} style={{ margin: 0, color: '#000', cursor: 'pointer', letterSpacing: '2px', fontWeight: 800 }} onClick={() => navigate('/')}>
            RAINBOW<span style={{ color: '#1890ff' }}>.</span>
          </Title>

        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            onPressEnter={(e) => onSearch(e.target.value)}
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            style={{ width: 250, borderRadius: 20 }}
            size="middle"
          />

          <Link to="/cart">
            <Badge count={cartCount} showZero size="small" color="#1890ff">
              <ShoppingCartOutlined style={{ fontSize: '22px', color: '#262626', cursor: 'pointer' }} />
            </Badge>
          </Link>

          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <Avatar size="default" style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
              </div>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button type="primary" shape="round" style={{ fontWeight: 500 }}>Đăng nhập</Button>
            </Link>
          )}
        </div>
      </Header>

      <Content style={{ padding: '40px 80px', flex: 1 }}>
        {children}
      </Content>

      <Footer style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '60px 80px 20px' }}>
        <Row gutter={48} style={{ marginBottom: 40 }}>
          <Col span={8}>
            <Title level={4} style={{ letterSpacing: '1px', fontWeight: 800 }}>RAINBOW.</Title>
            <Text type="secondary" style={{ display: 'block', marginTop: 16, lineHeight: 1.8 }}>
              Nền tảng mua sắm trực tuyến hàng đầu, mang đến cho bạn những trải nghiệm tuyệt vời và sản phẩm chất lượng nhất.
            </Text>
          </Col>
          <Col span={5} offset={3}>
            <Title level={5}>Về chúng tôi</Title>
            <Space direction="vertical" style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ cursor: 'pointer' }}>Câu chuyện thương hiệu</Text>
              <Text type="secondary" style={{ cursor: 'pointer' }}>Tuyển dụng</Text>
              <Text type="secondary" style={{ cursor: 'pointer' }}>Báo chí</Text>
            </Space>
          </Col>
          <Col span={4}>
            <Title level={5}>Hỗ trợ</Title>
            <Space direction="vertical" style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ cursor: 'pointer' }}>Trung tâm trợ giúp</Text>
              <Text type="secondary" style={{ cursor: 'pointer' }}>Thanh toán</Text>
              <Text type="secondary" style={{ cursor: 'pointer' }}>Giao hàng</Text>
            </Space>
          </Col>
          <Col span={4}>
            <Title level={5}>Chính sách</Title>
            <Space direction="vertical" style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ cursor: 'pointer' }}>Chính sách bảo mật</Text>
              <Text type="secondary" style={{ cursor: 'pointer' }}>Điều khoản dịch vụ</Text>
              <Text type="secondary" style={{ cursor: 'pointer' }}>Đổi trả</Text>
            </Space>
          </Col>
        </Row>
        <div style={{ textAlign: 'center', borderTop: '1px solid #f0f0f0', paddingTop: 20 }}>
          <Text type="secondary">© 2026 Rainbow Shop. All rights reserved.</Text>
        </div>
      </Footer>
    </Layout>
  );
};

export default CustomerLayout;
