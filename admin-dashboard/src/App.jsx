import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from "./components/MainLayout";
import ProductList from './pages/ProductList';
import UserList from './pages/UserList';
import Login from './pages/Login';       // Minh nhớ tạo file này nhé
import Register from './pages/Register'; // Minh nhớ tạo file này nhé
import CategoryList from './pages/CategoryList';
import OrderList from './pages/OrderList';
import PaymentList from './pages/PaymentList';
import CustomerLayout from './components/CustomerLayout';
import Home from './pages/customer/Home';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import VNPayReturn from './pages/customer/VNPayReturn';
import Profile from './pages/customer/Profile';
import Orders from './pages/customer/Orders';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Nhóm các trang KHÔNG CÓ Sidebar (Login, Register) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. Nhóm trang Admin (Sử dụng MainLayout) */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoleId={1}>
            <MainLayout>
              <Routes>
                <Route path="/" element={<h1>Trang Dashboard</h1>} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/payments" element={<PaymentList />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* 3. Nhóm trang Customer (Sử dụng CustomerLayout) */}
        <Route path="/*" element={
          <CustomerLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/vnpay-return" element={<VNPayReturn />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </CustomerLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;