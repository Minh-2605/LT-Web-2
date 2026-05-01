import { Layout, Menu, Button, Typography, Space } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Tính toán menu item đang được active dựa trên đường dẫn hiện tại
  let selectedKey = '1';
  if (location.pathname.includes('/categories')) selectedKey = '2';
  if (location.pathname.includes('/orders')) selectedKey = '3';
  if (location.pathname.includes('/payments')) selectedKey = '4';
  if (location.pathname.includes('/users')) selectedKey = '5';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark" breakpoint="lg" collapsedWidth="0">
        <div style={{ padding: '24px 16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Title level={4} style={{ color: '#fff', margin: 0, letterSpacing: '1px' }}>ADMIN PANEL</Title>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} style={{ padding: '16px 0', borderRight: 0 }}>
          <Menu.Item key="1">
            <Link to="/admin/products">Quản lý Sản phẩm</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/admin/categories">Quản lý Danh mục</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/admin/orders">Quản lý Đơn hàng</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/admin/payments">Quản lý Thanh toán</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/admin/users">Quản lý Người dùng</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,21,41,0.08)', zIndex: 1 }}>
          <Title level={4} style={{ margin: 0, color: '#262626' }}>HỆ THỐNG QUẢN TRỊ</Title>
          <Space>
            <Text type="secondary">Xin chào, Quản trị viên</Text>
            <Button type="primary" danger onClick={handleLogout} style={{ borderRadius: 4 }}>
              Đăng xuất
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: '24px', background: '#f5f5f5' }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minHeight: 360, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;