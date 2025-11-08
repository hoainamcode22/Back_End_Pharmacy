// Chat Context - Quản lý Socket.IO và trạng thái chat
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../AuthContext/AuthContext';
import { SOCKET_URL } from '../../config';
import api from '../../api';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [newMessageCount, setNewMessageCount] = useState(0);
  
  // Refs để theo dõi typing
  const typingTimeout = useRef(null);
  const isTypingRef = useRef(false);

  // Khởi tạo Socket.IO connection
  useEffect(() => {
    if (token && user) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        
        // Xác thực với server
        newSocket.emit('authenticate', token);
      });

      newSocket.on('authenticated', (data) => {
        if (data.success) {
          // Nếu là admin, join tất cả threads
          if (user.role === 'admin') {
            newSocket.emit('admin_join_all_threads');
          }
        }
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      // Chat events
      newSocket.on('thread_created', (thread) => {
        setThreads(prev => [thread, ...prev]);
        setCurrentThread(thread);
      });

      newSocket.on('new_thread_notification', (notification) => {
        if (user.role === 'admin') {
          // Thông báo thread mới cho admin
          loadThreads(); // Reload threads
        }
      });

      newSocket.on('thread_messages', (data) => {
        if (data.threadId === currentThread?.Id) {
          setMessages(data.messages);
        }
      });

      newSocket.on('new_message', (message) => {
        setMessages(prev => [...prev, message]);
        
        // Cập nhật thread list
        setThreads(prev => prev.map(thread => 
          thread.Id === message.ThreadId 
            ? { 
                ...thread, 
                LastMessage: message.Content,
                LastMessageAt: message.CreatedAt,
                UpdatedAt: message.CreatedAt
              }
            : thread
        ));

        // Tăng counter nếu không phải tin nhắn của mình
        if (message.SenderId !== user.id) {
          setNewMessageCount(prev => prev + 1);
        }
      });

      newSocket.on('user_typing', (data) => {
        if (data.threadId === currentThread?.Id && data.userId !== user.id) {
          setTypingUsers(prev => {
            const newMap = new Map(prev);
            newMap.set(data.userId, data.userName);
            return newMap;
          });
        }
      });

      newSocket.on('user_stop_typing', (data) => {
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          newMap.delete(data.userId);
          return newMap;
        });
      });

      newSocket.on('thread_closed', (data) => {
        setThreads(prev => prev.map(thread => 
          thread.Id === data.threadId 
            ? { ...thread, Status: 'closed' }
            : thread
        ));
      });

      newSocket.on('admin_threads_joined', (threads) => {
        // Admin đã join tất cả threads
      });

      newSocket.on('error', (error) => {
        // Socket.IO Error
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [token, user]);

  // Load threads từ API
  const loadThreads = async () => {
    try {
      const response = await api.get('/chat/threads');
      if (response.data.success) {
        setThreads(response.data.threads);
      }
    } catch (error) {
      // Lỗi load threads
    }
  };

  // Load threads khi component mount
  useEffect(() => {
    if (token) {
      loadThreads();
    }
  }, [token]);

  // Tạo thread mới
  const createThread = async (title, attachmentType = 'general', attachmentId = null) => {
    try {
      if (socket) {
        socket.emit('create_chat_thread', {
          title,
          attachmentType,
          attachmentId
        });
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  // Join thread
  const joinThread = (thread) => {
    if (socket && thread) {
      setCurrentThread(thread);
      setMessages([]);
      socket.emit('join_thread', thread.Id);
      
      // Reset message count cho thread này
      setNewMessageCount(0);
    }
  };

  // Gửi tin nhắn
  const sendMessage = (content) => {
    if (socket && currentThread && content.trim()) {
      socket.emit('send_message', {
        threadId: currentThread.Id,
        content: content.trim()
      });
      return true;
    }
    return false;
  };

  // Typing indicators
  const startTyping = () => {
    if (socket && currentThread && !isTypingRef.current) {
      socket.emit('typing', { threadId: currentThread.Id });
      isTypingRef.current = true;
    }

    // Clear existing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Set new timeout
    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (socket && currentThread && isTypingRef.current) {
      socket.emit('stop_typing', { threadId: currentThread.Id });
      isTypingRef.current = false;
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
  };

  // Đóng thread (admin only)
  const closeThread = async (threadId) => {
    try {
      const response = await api.patch(`/chat/threads/${threadId}/close`);
      if (response.data.success) {
        return true;
      }
    } catch (error) {
      // Lỗi đóng thread
    }
    return false;
  };

  // Get chat stats (admin only)
  const getChatStats = async () => {
    try {
      const response = await api.get('/chat/stats');
      if (response.data.success) {
        return response.data.stats;
      }
    } catch (error) {
      // Lỗi lấy stats
    }
    return null;
  };

  const contextValue = {
    // Connection state
    socket,
    isConnected,
    
    // Chat data
    threads,
    currentThread,
    messages,
    onlineUsers,
    typingUsers,
    newMessageCount,
    
    // Actions
    createThread,
    joinThread,
    sendMessage,
    startTyping,
    stopTyping,
    closeThread,
    loadThreads,
    getChatStats,
    
    // Utilities
    setCurrentThread,
    setNewMessageCount
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
