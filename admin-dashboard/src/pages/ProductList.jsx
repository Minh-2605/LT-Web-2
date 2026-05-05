import { Table, Button, Space, message, Popconfirm, Typography, Tag, Input } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import ProductModal from './ProductModal';
import { productApi } from '../api/productApi';

const { Title, Text } = Typography;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll();
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
      setFiltered(data);
    } catch {
      message.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    setFiltered(search ? products.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase())) : products);
  }, [search, products]);

  const handleDelete = async (id) => {
    try {
      await productApi.delete(id);
      message.success("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch {
      message.error("Xóa thất bại!");
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, values);
        message.success("Cập nhật thành công!");
      } else {
        await productApi.add(values);
        message.success("Thêm mới thành công!");
      }
      handleCancel();
      fetchProducts();
    } catch {
      message.error("Thao tác thất bại!");
    }
  };

  const handleCancel = () => { setIsModalOpen(false); setEditingProduct(null); };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image', key: 'image', width: 80,
      render: (img) => img ? (
        <img src={img} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10, border: '1px solid #e8f0fe' }} />
      ) : (
        <div style={{ width: 52, height: 52, background: '#f0f7ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛍️</div>
      ),
    },
    {
      title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName',
      render: (name) => <Text strong style={{ color: '#1a1a2e' }}>{name}</Text>
    },
    {
      title: 'Danh mục', dataIndex: 'category', key: 'category',
      render: (cat) => cat ? (
        <Tag style={{ background: '#e6f4ff', color: '#1677ff', border: '1px solid #91caff', borderRadius: 6, fontWeight: 600 }}>
          {cat.categoryName}
        </Tag>
      ) : <Text type="secondary">—</Text>
    },
    {
      title: 'Giá', dataIndex: 'price', key: 'price',
      render: (val) => <Text strong style={{ color: '#f5222d' }}>{Number(val || 0).toLocaleString()}đ</Text>
    },
    {
      title: 'Tồn kho', dataIndex: 'availability', key: 'availability',
      render: (val) => (
        <Tag color={val > 10 ? 'green' : val > 0 ? 'orange' : 'red'} style={{ fontWeight: 700, borderRadius: 6 }}>
          {val > 0 ? val : 'Hết hàng'}
        </Tag>
      )
    },
    {
      title: 'Thao tác', key: 'action', width: 140,
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="primary" size="small" icon={<EditOutlined />}
            style={{ borderRadius: 8, height: 32 }}
            onClick={() => { setEditingProduct(record); setIsModalOpen(true); }}
          >
            Sửa
          </Button>
          <Popconfirm title="Xác nhận xóa sản phẩm?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
            <Button danger size="small" icon={<DeleteOutlined />} style={{ borderRadius: 8, height: 32 }}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>📦 Quản lý Sản phẩm</Title>
          <Text style={{ color: '#6b7280' }}>{filtered.length} sản phẩm</Text>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#1677ff' }} />}
            placeholder="Tìm sản phẩm..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: 220, borderRadius: 10, height: 40 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}
            style={{ height: 40, borderRadius: 10, fontWeight: 600 }}>
            Thêm mới
          </Button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f0fe', overflow: 'hidden', boxShadow: '0 2px 12px rgba(22,119,255,0.05)' }}>
        <Table
          dataSource={filtered} columns={columns} loading={loading} rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          rowClassName={(_, i) => i % 2 === 0 ? '' : 'alt-row'}
        />
      </div>

      <ProductModal open={isModalOpen} initialValues={editingProduct} onCreate={handleSave} onCancel={handleCancel} />
    </div>
  );
};

export default ProductList;