import { Table, Button, Space, message, Popconfirm, Typography } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import ProductModal from './ProductModal';
import { productApi } from '../api/productApi';

const { Title } = Typography;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // 1. Lấy danh sách sản phẩm (Dùng API /api/products)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll();
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch {
      message.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2. Xử lý XÓA (Dùng API /admin/products/{id})
  const handleDelete = async (id) => {
    try {
      await productApi.delete(id);
      message.success("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch {
      message.error("Xóa thất bại! Kiểm tra lại quyền Admin.");
    }
  };

  // 3. Xử lý LƯU (Cả Thêm mới và Cập nhật)
  const handleSave = async (values) => {
    try {
      if (editingProduct) {
        // Cập nhật sản phẩm hiện có
        await productApi.update(editingProduct.id, values);
        message.success("Cập nhật thành công!");
      } else {
        // Thêm sản phẩm mới
        await productApi.add(values);
        message.success("Thêm mới thành công!");
      }
      handleCancel(); // Đóng modal và reset state
      fetchProducts();
    } catch {
      message.error("Thao tác thất bại, vui lòng kiểm tra lại Backend.");
    }
  };

  // 4. Reset trạng thái khi đóng Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (imageText) => (
        imageText ?
          <img src={imageText} alt="product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
          : 'Chưa có ảnh'
      ),
    },
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
    {
      title: 'Mô tả',
      dataIndex: 'discription', // Khớp với trường discription trong Product.java
      key: 'discription'
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      // Thêm hàm render này vào để hiển thị tên danh mục
      render: (category) => category ? category.categoryName : 'Chưa phân loại'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (val) => val ? `${Number(val).toLocaleString()}đ` : '0đ'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => {
            setEditingProduct(record); // Đưa dữ liệu cũ vào state để Modal hiển thị
            setIsModalOpen(true);
          }}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>Quản lý Sản phẩm</Title>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm sản phẩm mới
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        loading={loading}
        rowKey="id"
      />

      <ProductModal
        open={isModalOpen}
        initialValues={editingProduct} // Truyền dữ liệu cũ vào form
        onCreate={handleSave} // Dùng chung hàm handleSave để xử lý logic
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ProductList;