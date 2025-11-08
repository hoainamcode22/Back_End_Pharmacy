import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { useChat } from '../../../context/ChatContext/ChatContext';
import api from '../../../api';
import './AdminChatManagement.css';

const AdminChatManagement = () => {
  const { user } = useContext(AuthContext);
  const { 
    socket, 
    isConnected, 
    threadUsers, 
    activeUsers,
    sendMessage, 
    joinThread, 
    leaveThread 
  } = useChat();
  
  const [selectedThread, setSelectedThread] = useState(null);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    closed: 0
  });

  // Load all threads
  useEffect(() => {
    if (user?.role === 'admin') {
      loadAllThreads();
    }
  }, [user]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || user?.role !== 'admin') return;

    const handleNewMessage = (data) => {
      if (selectedThread && data.threadId === selectedThread.id) {
        setMessages(prev => [...prev, data]);
      }
      
      // Update thread list
      setThreads(prev => prev.map(thread => 
        thread.id === data.threadId 
          ? { ...thread, lastMessage: data.content, lastMessageAt: data.createdAt }
          : thread
      ));
    };

    const handleNewThread = (thread) => {
      setThreads(prev => [thread, ...prev]);
      setStats(prev => ({ ...prev, total: prev.total + 1, active: prev.active + 1 }));
    };

    const handleThreadClosed = ({ threadId }) => {
      setThreads(prev => prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, status: 'closed' }
          : thread
      ));
      setStats(prev => ({ ...prev, active: prev.active - 1, closed: prev.closed + 1 }));
    };

    socket.on('new_message', handleNewMessage);
    socket.on('new_thread', handleNewThread);
    socket.on('thread_closed', handleThreadClosed);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('new_thread', handleNewThread);
      socket.off('thread_closed', handleThreadClosed);
    };
  }, [socket, selectedThread, user]);

  const loadAllThreads = async () => {
    try {
      const response = await api.get('/api/chat/admin/threads');
      setThreads(response.data.threads || []);
      setStats(response.data.stats || { total: 0, active: 0, closed: 0 });
    } catch (error) {
      // Error loading threads
    } finally {
      setLoading(false);
    }
  };

  const loadThreadMessages = async (thread) => {
    try {
      const response = await api.get(`/api/chat/threads/${thread.id}/messages`);
      setMessages(response.data.messages || []);
      setSelectedThread(thread);
      
      // Join thread for real-time updates
      if (socket) {
        joinThread(thread.id);
      }
    } catch (error) {
      // Error loading messages
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedThread) return;

    try {
      await sendMessage(selectedThread.id, messageText);
      setMessageText('');
    } catch (error) {
      // Error sending message
    }
  };

  const handleCloseThread = async (threadId) => {
    try {
      await api.patch(`/api/chat/threads/${threadId}/close`);
      
      // Update local state
      setThreads(prev => prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, status: 'closed' }
          : thread
      ));

      if (selectedThread?.id === threadId) {
        setSelectedThread({ ...selectedThread, status: 'closed' });
      }
    } catch (error) {
      // Error closing thread
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  if (user?.role !== 'admin') {
    return (
      <div className="admin-chat-management">
        <div className="access-denied">
          <h3>Truy cập bị từ chối</h3>
          <p>Bạn không có quyền truy cập tính năng này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-chat-management">
      {/* Header */}
      <div className="chat-admin-header">
        <div className="header-title">
          <h2>Quản lý Chat hỗ trợ</h2>
          <div className="connection-status">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
            {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
          </div>
        </div>

        {/* Stats */}
        <div className="chat-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Tổng</span>
          </div>
          <div className="stat-item active">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Đang hoạt động</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.closed}</span>
            <span className="stat-label">Đã đóng</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{activeUsers.length}</span>
            <span className="stat-label">Người dùng online</span>
          </div>
        </div>
      </div>

      <div className="chat-admin-content">
        {/* Thread List */}
        <div className="threads-panel">
          <div className="threads-header">
            <h3>Danh sách hội thoại</h3>
            <button 
              className="refresh-btn"
              onClick={loadAllThreads}
              disabled={loading}
            >
              ↻
            </button>
          </div>

          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <div className="threads-list">
              {threads.map(thread => (
                <div
                  key={thread.id}
                  className={`thread-item ${selectedThread?.id === thread.id ? 'selected' : ''} ${thread.status}`}
                  onClick={() => loadThreadMessages(thread)}
                >
                  <div className="thread-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        {thread.userName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="user-details">
                        <h4>{thread.userName || 'Người dùng'}</h4>
                        <p className="thread-subject">{thread.subject}</p>
                      </div>
                    </div>
                    <div className="thread-meta">
                      <span className="thread-time">
                        {formatTime(thread.lastMessageAt || thread.createdAt)}
                      </span>
                      <span className={`status-badge ${thread.status}`}>
                        {thread.status === 'active' ? 'Hoạt động' : 'Đã đóng'}
                      </span>
                    </div>
                  </div>
                  
                  {thread.lastMessage && (
                    <div className="last-message">
                      {thread.lastMessage}
                    </div>
                  )}
                  
                  <div className="thread-footer">
                    <span className="message-count">
                      {thread.messageCount || 0} tin nhắn
                    </span>
                    <span className="thread-date">
                      {formatDate(thread.createdAt)}
                    </span>
                  </div>
                </div>
              ))}

              {threads.length === 0 && (
                <div className="empty-threads">
                  <p>Chưa có hội thoại nào</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className="chat-panel">
          {selectedThread ? (
            <>
              {/* Chat Header */}
              <div className="chat-panel-header">
                <div className="chat-user-info">
                  <div className="user-avatar large">
                    {selectedThread.userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="user-details">
                    <h3>{selectedThread.userName || 'Người dùng'}</h3>
                    <p className="user-email">{selectedThread.userEmail}</p>
                    <p className="thread-subject">{selectedThread.subject}</p>
                  </div>
                </div>
                
                <div className="chat-actions">
                  {threadUsers[selectedThread.id] && (
                    <div className="online-indicator">
                      <span className="status-dot connected"></span>
                      Đang online
                    </div>
                  )}
                  
                  {selectedThread.status === 'active' && (
                    <button
                      className="close-thread-btn"
                      onClick={() => handleCloseThread(selectedThread.id)}
                    >
                      Đóng hội thoại
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messages.map((message, index) => {
                  const showDateDivider = index === 0 || 
                    formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);

                  return (
                    <React.Fragment key={message.id}>
                      {showDateDivider && (
                        <div className="date-divider">
                          <span>{formatDate(message.createdAt)}</span>
                        </div>
                      )}
                      
                      <div className={`message ${message.senderRole === 'admin' ? 'admin' : 'user'}`}>
                        <div className="message-content">
                          <div className="sender-info">
                            <span className="sender-name">
                              {message.senderRole === 'admin' ? 'Bạn' : message.senderName}
                            </span>
                            <span className="message-time">
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                          <div className="message-bubble">
                            <p>{message.content}</p>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}

                {messages.length === 0 && (
                  <div className="empty-messages">
                    <p>Chưa có tin nhắn nào trong hội thoại này</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              {selectedThread.status === 'active' && (
                <div className="message-input-container">
                  <form onSubmit={handleSendMessage} className="message-form">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      disabled={!isConnected}
                    />
                    <button 
                      type="submit" 
                      className="send-btn"
                      disabled={!messageText.trim() || !isConnected}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                      </svg>
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="no-thread-selected">
              <div className="placeholder-content">
                <div className="placeholder-icon">💬</div>
                <h3>Chọn một hội thoại để bắt đầu</h3>
                <p>Chọn một hội thoại từ danh sách bên trái để xem tin nhắn và trả lời khách hàng.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatManagement;