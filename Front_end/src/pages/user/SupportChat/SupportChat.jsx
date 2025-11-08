// Support Chat Component - Chat interface cho user
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../../context/ChatContext/ChatContext';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import './SupportChat.css';

const SupportChat = () => {
  const { user } = useAuth();
  const {
    isConnected,
    threads,
    currentThread,
    messages,
    typingUsers,
    newMessageCount,
    createThread,
    joinThread,
    sendMessage,
    startTyping,
    stopTyping,
    loadThreads
  } = useChat();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  
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
      const success = sendMessage(inputMessage);
      if (success) {
        setInputMessage('');
        stopTyping();
      }
    }
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
    if (threadTitle.trim()) {
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

  return (
    <div className="support-chat">
      {/* Floating Chat Button */}
      <button 
        className={`chat-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen ? (
          <div className="chat-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="currentColor" className="chat-icon">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
            {newMessageCount > 0 && (
              <span className="message-badge">{newMessageCount}</span>
            )}
          </div>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="close-icon">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
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
                <span className={`status-dot ${isConnected ? 'online' : 'offline'}`}></span>
                {isConnected ? 'Đang kết nối' : 'Mất kết nối'}
              </p>
            </div>
            <button 
              className="minimize-btn"
              onClick={() => setIsOpen(false)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
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
                        <button type="submit" disabled={!threadTitle.trim()}>
                          Bắt đầu chat
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
                  // Thread list or welcome
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
                    
                    <button 
                      className="new-chat-btn"
                      onClick={() => setIsCreatingThread(true)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      Bắt đầu hội thoại mới
                    </button>
                  </div>
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
                    <form onSubmit={handleSendMessage} className="message-form">
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
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChat;