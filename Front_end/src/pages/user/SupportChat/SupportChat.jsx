// Support Chat Component - Chat interface cho user
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../../context/ChatContext/useChatHook';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import ProductPickerModal from '../../../components/ProductPickerModal/ProductPickerModal';
import ChatProductCard from '../../../components/ChatProductCard/ChatProductCard';
import './SupportChat.css';

const SupportChat = () => {
  const { user } = useAuth();
  const {
    isConnected,
    isAuthenticated,
    threads,
    currentThread,
    messages,
    typingUsers,
    newMessageCount,
    createThread,
    joinThread,
    sendMessage,
    startTyping,
    stopTyping
    // loadThreads - not used in this component
  } = useChat();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && currentThread) {
      const success = sendMessage(inputMessage, selectedProduct?.id);
      if (success) {
        setInputMessage('');
        setSelectedProduct(null);
        stopTyping();
      }
    }
  };

  // Handle product selection
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setShowProductPicker(false);
  };

  // Remove selected product
  const handleRemoveProduct = () => {
    setSelectedProduct(null);
  };

  // Handle input change with typing indicator
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  // Create new thread
  const handleCreateThread = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      console.warn('⚠️ Cannot create thread - not authenticated yet');
      alert('Đang kết nối... Vui lòng thử lại sau giây lát.');
      return;
    }
    
    if (threadTitle.trim()) {
      console.log('✅ Creating thread - authenticated:', isAuthenticated);
      const success = await createThread(threadTitle.trim());
      if (success) {
        setThreadTitle('');
        setIsCreatingThread(false);
      }
    }
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  if (!user) return null;

  // Debug logs
  console.log('SupportChat render - currentThread:', currentThread);
  console.log('SupportChat render - threads:', threads);
  console.log('SupportChat render - isCreatingThread:', isCreatingThread);
  console.log('SupportChat render - isAuthenticated:', isAuthenticated);
  console.log('SupportChat render - isOpen:', isOpen);

  return (
    <div className="support-chat">
      {/* Floating Chat Button */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen ? (
          <div className="chat-icon-wrapper">
            💬
            {newMessageCount > 0 && (
              <span className="message-badge">{newMessageCount}</span>
            )}
          </div>
        ) : (
          <div className="close-icon">✕</div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="header-info">
              <h3>💬 Hỗ trợ y tế</h3>
              <p className="status">
                <span className={`status-dot ${isConnected && isAuthenticated ? 'online' : 'offline'}`}></span>
                {isConnected && isAuthenticated ? 'Đã kết nối' : isConnected ? 'Đang xác thực...' : 'Mất kết nối'}
              </p>
            </div>
            <button 
              className="minimize-btn"
              onClick={() => setIsOpen(false)}
            >
              ➖
            </button>
          </div>

          {/* Thread List & Chat Area */}
          <div className="chat-content">
            {!currentThread ? (
              // Thread selection or creation
              <div className="thread-selection">
                {isCreatingThread ? (
                  // Create thread form
                  <div className="create-thread-form">
                    <h4>🩺 Bắt đầu cuộc hội thoại mới</h4>
                    <form onSubmit={handleCreateThread}>
                      <input
                        type="text"
                        placeholder="Tôi muốn hỏi về..."
                        value={threadTitle}
                        onChange={(e) => setThreadTitle(e.target.value)}
                        autoFocus
                      />
                      <div className="form-actions">
                        <button type="submit" disabled={!threadTitle.trim() || !isAuthenticated}>
                          {!isAuthenticated ? 'Đang kết nối...' : 'Bắt đầu chat'}
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setIsCreatingThread(false)}
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  // === FIX: Bọc bằng Fragment để trả về 2 phần tử ===
                  <>
                    {/* Thread list or welcome */}
                    <div className="welcome-screen">
                      {threads.length > 0 ? (
                        <div className="thread-list">
                          <h4>Các cuộc hội thoại của bạn:</h4>
                          {threads.map(thread => (
                            <div 
                              key={thread.Id}
                              className={`thread-item ${thread.Status === 'closed' ? 'closed' : ''}`}
                              onClick={() => joinThread(thread)}
                            >
                              <div className="thread-header">
                                <h5>{thread.Title}</h5>
                                <span className="thread-date">
                                  {formatDate(thread.UpdatedAt)}
                                </span>
                              </div>
                              {thread.LastMessage && (
                                <p className="last-message">{thread.LastMessage}</p>
                              )}
                              <div className="thread-meta">
                                <span className={`status-badge ${thread.Status}`}>
                                  {thread.Status === 'active' ? 'Đang hoạt động' : 'Đã đóng'}
                                </span>
                                {thread.MessageCount && (
                                  <span className="message-count">
                                    {thread.MessageCount} tin nhắn
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="welcome-message">
                          <div className="welcome-icon">🩺</div>
                          <h4>Chào mừng đến dịch vụ tư vấn y tế!</h4>
                          <p>Bác sĩ của chúng tôi sẵn sàng hỗ trợ bạn 24/7</p>
                        </div>
                      )}
                      
                      {/* === FIX: Nút này đã bị dời ra ngoài === */}
                    </div>

                    {/* === FIX: Nút tạo hội thoại mới đã được dời xuống đây === */}
                    <div className="new-chat-section">
                      <button 
                        className="new-chat-btn"
                        onClick={() => setIsCreatingThread(true)}
                        disabled={!isAuthenticated}
                        title={!isAuthenticated ? 'Đang kết nối...' : 'Bắt đầu hội thoại mới'}
                      >
                        <span style={{ fontSize: '18px', marginRight: '8px' }}>➕</span>
                        {!isAuthenticated ? 'Đang kết nối...' : 'Bắt đầu hội thoại mới'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Active chat
              <div className="active-chat">
                {/* Chat header */}
                <div className="chat-thread-header">
                  <button 
                    className="back-btn"
                    onClick={() => joinThread(null)}
                    title="Quay lại danh sách hội thoại"
                  >
                    ←
                  </button>
                  <div className="thread-info">
                    <h4>{currentThread.Title}</h4>
                    <p className="thread-status">
                      {currentThread.Status === 'active' ? 
                        '🟢 Đang hoạt động' : 
                        '🔴 Đã đóng'
                      }
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="messages-container">
                  {messages.length > 0 ? (
                    messages.map((message, index) => {
                      const isOwnMessage = message.SenderId === user.id;
                      const showDate = index === 0 || 
                        formatDate(messages[index - 1].CreatedAt) !== formatDate(message.CreatedAt);

                      return (
                        <div key={message.Id}>
                          {showDate && (
                            <div className="date-divider">
                              {formatDate(message.CreatedAt)}
                            </div>
                          )}
                          <div className={`message ${isOwnMessage ? 'own' : 'other'}`}>
                            <div className="message-content">
                              {!isOwnMessage && (
                                <div className="sender-info">
                                  <span className="sender-role">
                                    {message.SenderRole === 'admin' ? '👨‍⚕️ Bác sĩ' : '👤 Bạn'}
                                  </span>
                                  <span className="sender-name">
                                    {message.SenderName || message.SenderUsername}
                                  </span>
                                </div>
                              )}
                              <div className="message-bubble">
                                <p>{message.Content}</p>
                                {/* Hiển thị sản phẩm đính kèm */}
                                {message.product && (
                                  <ChatProductCard product={message.product} />
                                )}
                              </div>
                              <div className="message-time">
                                {formatTime(message.CreatedAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-messages">
                      <p>Hãy bắt đầu cuộc hội thoại bằng cách gửi tin nhắn đầu tiên! 👋</p>
                    </div>
                  )}

                  {/* Typing indicator */}
                  {typingUsers.size > 0 && (
                    <div className="typing-indicator">
                      <div className="typing-animation">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="typing-text">
                        {Array.from(typingUsers.values()).join(', ')} đang nhập...
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                {currentThread.Status === 'active' && (
                  <div className="message-input-container">
                    {/* Hiển thị sản phẩm đã chọn */}
                    {selectedProduct && (
                      <div className="selected-product-preview">
                        <div className="preview-content">
                          <img 
                            src={`http://localhost:5001/images/products/${selectedProduct.Image}`} 
                            alt={selectedProduct.Name}
                          />
                          <div className="preview-info">
                            <p className="preview-name">{selectedProduct.Name}</p>
                            <p className="preview-price">{selectedProduct.Price?.toLocaleString('vi-VN')}đ</p>
                          </div>
                          <button 
                            type="button"
                            className="remove-product-btn"
                            onClick={handleRemoveProduct}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <form onSubmit={handleSendMessage} className="message-form">
                      <button
                        type="button"
                        className="attach-btn"
                        onClick={() => setShowProductPicker(true)}
                        title="Đính kèm sản phẩm"
                      >
                        📎
                      </button>
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={inputMessage}
                        onChange={handleInputChange}
                        disabled={!isConnected}
                      />
                      <button 
                        type="submit" 
                        disabled={!inputMessage.trim() || !isConnected}
                        className="send-btn"
                      >
                        ➤
                      </button>
                    </form>
                  </div>
                )}
                
                {currentThread.Status === 'closed' && (
                  <div className="thread-closed-notice">
                    <p>⚠️ Cuộc trò chuyện này đã được đóng. Vui lòng tạo cuộc trò chuyện mới.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Product Picker Modal */}
      <ProductPickerModal
        isOpen={showProductPicker}
        onClose={() => setShowProductPicker(false)}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
};

export default SupportChat;