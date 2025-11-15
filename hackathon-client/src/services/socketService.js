import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Kết nối đến WebSocket server
  connect() {
    if (this.socket && this.isConnected) {
      console.log('⚠️ Socket already connected');
      return this.socket;
    }

    this.socket = io('http://localhost:10000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  // Tham gia vào room của classroom
  joinClassroom(classroomId, chatBoxId, type) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    this.socket.emit('joinClassroom', {
      classroomId,
      chatBoxId,
      type, // 'in_class' hoặc 'off_topic'
    });

    console.log(`🚪 Joining room: ${classroomId}-${type}`);
  }

  // Rời khỏi room
  leaveClassroom(classroomId, type) {
    if (!this.socket) return;

    this.socket.emit('leaveClassroom', {
      classroomId,
      type,
    });

    console.log(`🚪 Leaving room: ${classroomId}-${type}`);
  }

  // Lắng nghe tin nhắn mới
  onMessageReceived(callback) {
    if (!this.socket) return;

    this.socket.on('messageReceived', (message) => {
      console.log('📩 New message received:', message);
      callback(message);
    });
  }

  // Lắng nghe thay đổi trạng thái chat
  onChatStatusChanged(callback) {
    if (!this.socket) return;

    this.socket.on('chatStatusChanged', (data) => {
      console.log('🔄 Chat status changed:', data);
      callback(data.isActive);
    });
  }

  // Hủy lắng nghe sự kiện
  off(eventName) {
    if (this.socket) {
      this.socket.off(eventName);
    }
  }

  // Ngắt kết nối
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected');
    }
  }

  // Kiểm tra kết nối
  isSocketConnected() {
    return this.socket && this.isConnected;
  }
}

// Export singleton instance
export default new SocketService();
