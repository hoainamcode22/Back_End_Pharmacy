// Chat Context - Quản lý Socket.IO và trạng thái chat
import React, { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../AuthContext/AuthContext';
import { SOCKET_URL } from '../../config';
import api from '../../api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers] = useState(new Set());
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
        console.log('🔌 Socket connected:', newSocket.id);
        setIsConnected(true);
        
        // Xác thực với server
        console.log('🔐 Authenticating socket with token...');
        newSocket.emit('authenticate', token);
      });

      newSocket.on('authenticated', (data) => {
        console.log('✅ Socket authenticated:', data);
        if (data.success) {
          console.log(`👤 User role: ${user.role}, ID: ${user.id}`);
          
          // Nếu là admin, join tất cả threads
          if (user.role === 'admin') {
            console.log('👨‍💼 Admin detected - joining admin_room and all threads');
            newSocket.emit('admin_join_all_threads');
          }
        } else {
          console.error('❌ Socket authentication failed:', data.error);
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
        console.log('🔔 New thread notification received:', notification);
        if (user.role === 'admin') {
          console.log('📥 Admin reloading threads...');
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

      newSocket.on('admin_threads_joined', () => {
        // Admin đã join tất cả threads
        console.log('✅ Admin joined all thread rooms');
      });

      newSocket.on('error', (err) => {
        // Socket.IO Error
        console.error('❌ Socket error:', err);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  // Load threads từ API
  const loadThreads = async () => {
    try {
      const response = await api.get('/chat/threads');
      if (response.data.success) {
        setThreads(response.data.threads);
      }
    } catch (err) {
      console.error('Error loading threads:', err);
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
      return false;
    } catch (err) {
      console.error('Error creating thread:', err);
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
      return false;
    } catch (err) {
      console.error('Error closing thread:', err);
      return false;
    }
  };

  // Get chat stats (admin only)
  const getChatStats = async () => {
    try {
      const response = await api.get('/chat/stats');
      if (response.data.success) {
        return response.data.stats;
      }
      return null;
    } catch (err) {
      console.error('Error getting chat stats:', err);
      return null;
    }
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
