import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetail, addToCart } from "../../../api";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import axios from "axios";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Comment states
  const [comments, setComments] = useState([]);
  const [commentStats, setCommentStats] = useState({ averageRating: 0, totalComments: 0 });
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: "" });
  const [activeTab, setActiveTab] = useState("description");
  // const [selectedImage, setSelectedImage] = useState(0); // TODO: For gallery

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetail(id);
        
        // API now returns camelCase fields and absolute imageUrl (if available)
        const imagePath = data.imageUrl || data.image || "/images/products/default.jpg";

        // Transform API data
        const transformedProduct = {
          id: data.id,
          name: data.name,
          price: parseFloat(data.price || 0),
          category: data.category,
          stock: data.stock || 0,
          image: imagePath,
          description: data.shortDesc || data.description || '',
          details: data.description,
          brand: data.brand || "N/A",
          origin: "Việt Nam"
        };
        setProduct(transformedProduct);
        setError(null);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
        setTimeout(() => navigate("/shop"), 2000);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
        const response = await axios.get(`${baseURL}/api/comments/${id}`);
        setComments(response.data.comments || []);
        setCommentStats({
          averageRating: response.data.averageRating || 0,
          totalComments: response.data.totalComments || 0
        });
      } catch (err) {
        console.error("Error loading comments:", err);
      }
    };

    if (id) {
      loadComments();
    }
  }, [id]);

  // Check if user can review
  useEffect(() => {
    const checkReviewPermission = async () => {
      if (!user) {
        setCanReview(false);
        return;
      }

      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/comments/check/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCanReview(response.data.canReview);
      } catch (err) {
        console.error("Error checking review permission:", err);
        setCanReview(false);
      }
    };

    if (id) {
      checkReviewPermission();
    }
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    try {
      await addToCart(product.id, quantity);
      alert(`✓ Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
      setQuantity(1); // Reset
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Lỗi: " + (err.response?.data?.error || "Không thể thêm vào giỏ hàng"));
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      alert("⚠️ Vui lòng đăng nhập để mua hàng!");
      navigate("/login");
      return;
    }

    try {
      // Thêm vào giỏ trước
      await addToCart(product.id, quantity);
      // Sau đó chuyển đến trang checkout luôn
      navigate("/checkout");
    } catch (err) {
      console.error("Error in buy now:", err);
      alert("❌ Lỗi: " + (err.response?.data?.error || "Không thể mua hàng"));
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Vui lòng đăng nhập để đánh giá!");
      navigate("/login");
      return;
    }

    if (!reviewForm.content.trim()) {
      alert("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
      const token = localStorage.getItem('token');
      
      await axios.post(`${baseURL}/api/comments`, {
        productId: id,
        rating: reviewForm.rating,
        content: reviewForm.content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✓ Đánh giá của bạn đã được gửi thành công!");
      
      // Reload comments
      const response = await axios.get(`${baseURL}/api/comments/${id}`);
      setComments(response.data.comments || []);
      setCommentStats({
        averageRating: response.data.averageRating || 0,
        totalComments: response.data.totalComments || 0
      });

      // Reset form
      setReviewForm({ rating: 5, content: "" });
      setShowReviewForm(false);
      setCanReview(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("❌ " + (err.response?.data?.error || "Không thể gửi đánh giá!"));
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "star filled" : "star"}>★</span>
        ))}
      </div>
    );
  };

  const increaseQty = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="loading">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="product-detail-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/shop")} className="breadcrumb-link">Trang chủ</span>
        <span className="breadcrumb-separator">›</span>
        <span onClick={() => navigate("/shop")} className="breadcrumb-link">{product.category}</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-detail-content">
        {/* Left: Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img 
              src={product.image || "https://via.placeholder.com/500x500?text=Thuốc"} 
              alt={product.name}
            />
            {product.discount && (
              <div className="discount-badge">-{product.discount}%</div>
            )}
          </div>
          {/* Thumbnail images - TODO: Add multiple images support */}
          <div className="thumbnail-list">
            <div className="thumbnail active">
              <img src={product.image || "https://via.placeholder.com/80x80"} alt="thumb" />
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="product-info-section">
          {/* Product Name & Category */}
          <div className="product-header">
            <span className="product-category">{product.category}</span>
            <h1 className="product-name">{product.name}</h1>
            <div className="product-meta">
              <span className="brand">Thương hiệu: <strong>{product.brand || "Đang cập nhật"}</strong></span>
              <span className="separator">|</span>
              <span className="stock">
                Tình trạng: 
                {product.stock > 10 ? (
                  <strong className="in-stock"> Còn hàng</strong>
                ) : product.stock > 0 ? (
                  <strong className="low-stock"> Sắp hết ({product.stock} sản phẩm)</strong>
                ) : (
                  <strong className="out-of-stock"> Hết hàng</strong>
                )}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="price-section">
            <div className="current-price">
              {product.price.toLocaleString()}đ
            </div>
            {product.originalPrice && (
              <div className="original-price">
                {product.originalPrice.toLocaleString()}đ
              </div>
            )}
          </div>

          {/* Short Description */}
          <div className="short-description">
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label>Số lượng:</label>
            <div className="quantity-controls">
              <button className="qty-btn" onClick={decreaseQty} disabled={quantity <= 1}>
                −
              </button>
              <input 
                type="text" 
                className="qty-input" 
                value={quantity} 
                readOnly
              />
              <button className="qty-btn" onClick={increaseQty} disabled={quantity >= product.stock}>
                +
              </button>
            </div>
            <span className="stock-info">{product.stock} sản phẩm có sẵn</span>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn-add-cart" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 2L7 8h10l-2-6M7 8l-3 12h16l-3-12M7 8h10" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Thêm vào giỏ
            </button>
            <button 
              className="btn-buy-now" 
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Mua ngay
            </button>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2"/>
                <path d="M12 6V12L16 14" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Giao hàng nhanh 2-4 giờ nội thành</span>
            </div>
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Cam kết hàng chính hãng 100%</span>
            </div>
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 11L12 14L22 4M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Đổi trả trong 7 ngày nếu có lỗi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="product-tabs">
        <div className="tab-header">
          <button 
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Mô tả sản phẩm
          </button>
          <button 
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Thành phần & Liều dùng
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Đánh giá ({commentStats.totalComments})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-content">
              <h3>Thông tin chi tiết</h3>
              <p>{product.details}</p>
              <div className="product-specs">
                <div className="spec-row">
                  <span className="spec-label">Thương hiệu:</span>
                  <span className="spec-value">{product.brand || "Đang cập nhật"}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Xuất xứ:</span>
                  <span className="spec-value">{product.origin || "Đang cập nhật"}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Danh mục:</span>
                  <span className="spec-value">{product.category}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="specs-content">
              <h3>Thành phần & Liều dùng</h3>
              <p>Thông tin chi tiết đang được cập nhật...</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              {/* Rating Summary */}
              <div className="rating-summary">
                <div className="average-rating">
                  <div className="rating-number">{commentStats.averageRating}</div>
                  <div className="rating-stars">
                    {renderStars(Math.round(commentStats.averageRating))}
                  </div>
                  <div className="rating-count">{commentStats.totalComments} đánh giá</div>
                </div>
              </div>

              {/* Write Review Button */}
              {user && canReview && !showReviewForm && (
                <button 
                  className="btn-write-review"
                  onClick={() => setShowReviewForm(true)}
                >
                  ✍️ Viết đánh giá
                </button>
              )}

              {/* Review Form */}
              {showReviewForm && (
                <div className="review-form-container">
                  <h3>Viết đánh giá của bạn</h3>
                  <form onSubmit={handleSubmitReview} className="review-form">
                    <div className="form-group">
                      <label>Đánh giá của bạn:</label>
                      <div className="star-selector">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= reviewForm.rating ? "star filled" : "star"}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            style={{ cursor: 'pointer', fontSize: '24px' }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Nội dung đánh giá:</label>
                      <textarea
                        value={reviewForm.content}
                        onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        rows="5"
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-submit-review">
                        Gửi đánh giá
                      </button>
                      <button 
                        type="button" 
                        className="btn-cancel-review"
                        onClick={() => {
                          setShowReviewForm(false);
                          setReviewForm({ rating: 5, content: "" });
                        }}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Comments List */}
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-reviews">Chưa có đánh giá nào cho sản phẩm này.</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.Id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-user">
                          <strong>{comment.Fullname || comment.Username}</strong>
                          {renderStars(comment.Rating)}
                        </div>
                        <div className="comment-date">
                          {new Date(comment.CreatedAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <div className="comment-content">
                        {comment.Content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
