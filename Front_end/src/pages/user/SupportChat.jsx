import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import "./SupportChat.css";

export default function SupportChat({ onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "system",
      text: "Xin chào! Chúng tôi có thể giúp gì cho bạn?",
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  // Scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    // TODO: Thay đổi URL này thành WebSocket server của bạn
    const wsUrl = "ws://localhost:3001/chat";
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        setIsConnected(true);
        
        // Gửi thông tin user khi connect
        ws.send(JSON.stringify({
          type: "join",
          userId: user?.id || "guest",
          userName: user?.name || "Khách"
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === "typing") {
          setIsTyping(data.isTyping);
        } else if (data.type === "message") {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: "received",
            text: data.text,
            time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
          }]);
        }
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log("🔌 WebSocket disconnected");
        setIsConnected(false);
      };

    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      setIsConnected(false);
    }

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: "sent",
      text: inputMessage,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, newMessage]);

    // Gửi qua WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "message",
        text: inputMessage,
        userId: user?.id || "guest",
        userName: user?.name || "Khách"
      }));
    }

    setInputMessage("");

    // Mock response (nếu không có WebSocket server)
    if (!isConnected) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: "received",
            text: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!",
            time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
          }]);
        }, 1500);
      }, 500);
    }
  };

  return (
    <div className="support-chat">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="operator-avatar">
            <span>👨‍⚕️</span>
          </div>
          <div className="operator-info">
            <h3>Hỗ trợ Pharmacy</h3>
            <p className={`status ${isConnected ? "online" : "offline"}`}>
              <span className="status-dot"></span>
              {isConnected ? "Đang hoạt động" : "Đang kết nối..."}
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
          <div key={msg.id} className={`message ${msg.type}`}>
            {msg.type === "received" && (
              <div className="message-avatar">👨‍⚕️</div>
            )}
            <div className="message-bubble">
              <p>{msg.text}</p>
              <span className="message-time">{msg.time}</span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message received">
            <div className="message-avatar">👨‍⚕️</div>
            <div className="message-bubble typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <button type="button" className="attach-btn" title="Đính kèm file">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" strokeWidth="2"/>
          </svg>
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder="Nhập tin nhắn..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit" className="send-btn" disabled={!inputMessage.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="22" y1="2" x2="11" y2="13" strokeWidth="2"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2" strokeWidth="2"/>
          </svg>
        </button>
      </form>
    </div>
  );
}
