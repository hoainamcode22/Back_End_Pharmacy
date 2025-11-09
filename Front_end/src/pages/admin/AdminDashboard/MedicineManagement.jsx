import React, { useState, useEffect } from "react";
import { 
  getAllProductsAdmin, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  toggleProductStatus 
} from "../../../api";
import "./MedicineManagement.css";

export default function MedicineManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    shortDesc: "",
    description: "",
    category: "thuoc",
    brand: "",
    image: "",
    price: "",
    stock: ""
  });

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, categoryFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 20 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;

      const data = await getAllProductsAdmin(params);
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error("Error loading products:", err);
      alert(err.response?.data?.error || "Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      shortDesc: "",
      description: "",
      category: "thuoc",
      brand: "",
      image: "",
      price: "",
      stock: ""
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.Name || "",
      shortDesc: product.ShortDesc || "",
      description: product.Description || "",
      category: product.Category || "thuoc",
      brand: product.Brand || "",
      image: product.Image || "",
      price: product.Price || "",
      stock: product.Stock || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.Id, formData);
        alert("✅ Cập nhật sản phẩm thành công!");
      } else {
        await createProduct(formData);
        alert("✅ Tạo sản phẩm mới thành công!");
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert(err.response?.data?.error || "Lỗi khi lưu sản phẩm");
    }
  };

  const handleToggleStatus = async (product) => {
    if (!window.confirm(`Bạn muốn ${product.IsActive ? 'TẮT' : 'BẬT'} sản phẩm "${product.Name}"?`)) {
      return;
    }

    try {
      await toggleProductStatus(product.Id);
      alert("✅ Đã cập nhật trạng thái sản phẩm!");
      loadProducts();
    } catch (err) {
      console.error("Error toggling status:", err);
      alert(err.response?.data?.error || "Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.Name}"?`)) {
      return;
    }

    try {
      await deleteProduct(product.Id);
      alert("✅ Đã xóa sản phẩm thành công!");
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.response?.data?.error || "Lỗi khi xóa sản phẩm");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="medicine-management">
      <div className="page-header">
        <h1>💊 Quản lý Sản phẩm</h1>
        <button onClick={handleAddNew} className="btn-add-new">
          ➕ Thêm sản phẩm mới
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên sản phẩm..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="search-input"
        />
        <select 
          value={categoryFilter} 
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className="filter-select"
        >
          <option value="">Tất cả danh mục</option>
          <option value="thuoc">Thuốc</option>
          <option value="vitamin">Vitamin & Thực phẩm chức năng</option>
          <option value="cham-soc">Chăm sóc sức khỏe</option>
          <option value="thiet-bi">Thiết bị y tế</option>
        </select>
        <button onClick={loadProducts} className="btn-refresh">
          🔄 Làm mới
        </button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Thương hiệu</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map(product => (
                    <tr key={product.Id}>
                      <td>
                        <img 
                          src={product.ImageUrl || '/images/default.jpg'} 
                          alt={product.Name}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = '/images/default.jpg';
                          }}
                        />
                      </td>
                      <td className="product-name">{product.Name}</td>
                      <td>
                        <span className={`category-badge ${product.Category}`}>
                          {product.Category === 'thuoc' && 'Thuốc'}
                          {product.Category === 'vitamin' && 'Vitamin'}
                          {product.Category === 'cham-soc' && 'Chăm sóc'}
                          {product.Category === 'thiet-bi' && 'Thiết bị'}
                        </span>
                      </td>
                      <td>{product.Brand || '-'}</td>
                      <td className="product-price">{formatCurrency(product.Price)}</td>
                      <td>
                        <span className={`stock-badge ${product.Stock < 10 ? 'low' : ''}`}>
                          {product.Stock} {product.Stock < 10 && '⚠️'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(product)}
                          className={`status-toggle ${product.IsActive ? 'active' : 'inactive'}`}
                        >
                          {product.IsActive ? '✅ Đang bán' : '❌ Đã tắt'}
                        </button>
                      </td>
                      <td className="actions">
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn-edit"
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="btn-delete"
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-message">
                      Không tìm thấy sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-page"
              >
                ← Trước
              </button>
              <span className="page-info">
                Trang {pagination.currentPage} / {pagination.totalPages}
                ({pagination.totalItems} sản phẩm)
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className="btn-page"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Paracetamol 500mg"
                  />
                </div>
                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="thuoc">Thuốc</option>
                    <option value="vitamin">Vitamin & TPCN</option>
                    <option value="cham-soc">Chăm sóc sức khỏe</option>
                    <option value="thiet-bi">Thiết bị y tế</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="VD: 50000"
                  />
                </div>
                <div className="form-group">
                  <label>Tồn kho *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="VD: 100"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Thương hiệu</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="VD: Traphaco"
                />
              </div>

              <div className="form-group">
                <label>Mô tả ngắn</label>
                <input
                  type="text"
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Mô tả ngắn gọn về sản phẩm"
                />
              </div>

              <div className="form-group">
                <label>Mô tả chi tiết</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về sản phẩm, công dụng, cách dùng..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>URL Hình ảnh</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="VD: paracetamol.jpg hoặc URL đầy đủ"
                />
                <small className="form-hint">
                  Nhập tên file (VD: paracetamol.jpg) hoặc URL đầy đủ
                </small>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
