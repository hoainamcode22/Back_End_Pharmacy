import { useState, useEffect, useRef } from "react";
import { getChatThreads, createChatThread, getChatMessages, sendChatMessage } from "../../api";
import "./SupportChat.css";

export default function SupportChat({ onClose }) {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Load threads khi component mount
  useEffect(() => {
    loadThreads();
  }, []);

  // Load messages khi chọn thread
  useEffect(() => {
    if (selectedThread) {
      loadMessages(selectedThread.Id);
    }
  }, [selectedThread]);

  const loadThreads = async () => {
    try {
      setLoading(true);
      const data = await getChatThreads();
      setThreads(data.threads || []);
      if (data.threads && data.threads.length > 0) {
        setSelectedThread(data.threads[0]);
      }
    } catch (err) {
      console.error("Error loading threads:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (threadId) => {
    try {
      const data = await getChatMessages(threadId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const handleCreateThread = async () => {
    const title = prompt("Nhập tiêu đề cuộc hội thoại:");
    if (!title) return;

    try {
      const res = await createChatThread({
        title: title,
        attachmentType: "general",
        attachmentId: "0"
      });
      
      setThreads([res.thread, ...threads]);
      setSelectedThread(res.thread);
      setMessages([]);
    } catch (err) {
      alert("Lỗi tạo cuộc hội thoại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !selectedThread) return;

    try {
      setSendingMessage(true);
      const res = await sendChatMessage(selectedThread.Id, inputMessage);
      
      // Add message to local state
      setMessages([...messages, res.message]);
      setInputMessage("");
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      alert("Lỗi gửi tin nhắn: " + (err.response?.data?.message || err.message));
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="support-chat">
      {/* Chat Threads Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Cuộc hội thoại</h3>
          <button className="new-thread-btn" onClick={handleCreateThread} title="Cuộc hội thoại mới">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
        
        <div className="threads-list">
          {loading && <p className="loading-text">Đang tải cuộc hội thoại...</p>}
          {threads.map(thread => (
            <div 
              key={thread.Id} 
              className={`thread-item ${selectedThread?.Id === thread.Id ? "active" : ""}`}
              onClick={() => setSelectedThread(thread)}
            >
              <h4>{thread.Title}</h4>
              <p className="thread-preview">{thread.LastMessage}</p>
              <span className="thread-date">
                {new Date(thread.UpdatedAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Main Area */}
      <div className="chat-main">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="operator-avatar">
                  <span>👨‍⚕️</span>
                </div>
                <div className="operator-info">
                  <h3>{selectedThread.Title}</h3>
                  <p className="status online">
                    <span className="status-dot"></span>
                    Đang hoạt động
                  </p>
                </div>
              </div>
              {onClose && (
                <button className="close-chat-btn" onClick={onClose}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.Id} className={`message ${msg.Sender === 'user' ? 'sent' : 'received'}`}>
                  {msg.Sender !== 'user' && (
                    <div className="message-avatar">👨‍⚕️</div>
                  )}
                  <div className="message-bubble">
                    <p>{msg.Content}</p>
                    <span className="message-time">
                      {new Date(msg.CreatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form className="chat-input-container" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={sendingMessage}
              />
              <button type="submit" className="send-btn" disabled={!inputMessage.trim() || sendingMessage}>
                {sendingMessage ? "Đang gửi..." : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="22" y1="2" x2="11" y2="13" strokeWidth="2"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="empty-state">
            <p>Chọn cuộc hội thoại để tiếp tục</p>
            <button className="new-thread-btn-large" onClick={handleCreateThread}>
              Tạo cuộc hội thoại mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
