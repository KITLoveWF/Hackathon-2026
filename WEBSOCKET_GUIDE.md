# Hướng dẫn triển khai WebSocket

## ✅ Đã hoàn thành

### **Backend (NestJS)**

1. **WebSocket Gateway** (`hackathon/src/gateway/ws.gateway.ts`)
   - ✅ Đã cấu hình CORS cho localhost:5173
   - ✅ Xử lý kết nối/ngắt kết nối client
   - ✅ Hỗ trợ join/leave room theo classroom
   - ✅ Broadcast message đến room cụ thể
   - ✅ Cập nhật trạng thái chat (mở/đóng)

2. **Service Integration** (`hackathon/src/hackathon/service/hackathon.service.ts`)
   - ✅ Inject WsGateway vào HackathonService
   - ✅ Broadcast tin nhắn mới qua WebSocket sau khi lưu DB
   - ✅ Tự động gửi message đến đúng room

3. **Module Configuration** 
   - ✅ WsGateway được thêm vào HackathonModule
   - ✅ Đã export HackathonService để sử dụng trong module khác

### **Frontend (React + Vite)**

1. **Socket Service** (`hackathon-client/src/services/socketService.js`)
   - ✅ Singleton pattern để quản lý 1 kết nối duy nhất
   - ✅ Auto reconnection khi mất kết nối
   - ✅ Hỗ trợ join/leave room
   - ✅ Lắng nghe tin nhắn mới
   - ✅ Xử lý trạng thái kết nối

2. **Chatbox Component** (`hackathon-client/src/pages/Chatbox.jsx`)
   - ✅ Kết nối WebSocket khi component mount
   - ✅ Join vào 2 room: in_class và off_topic
   - ✅ Tự động cập nhật UI khi nhận message mới
   - ✅ Cleanup khi unmount

---

## 🚀 Cách sử dụng

### **1. Khởi động Backend**

```bash
cd hackathon
npm run start:dev
```

Server sẽ chạy tại: `http://localhost:10000`

### **2. Khởi động Frontend**

```bash
cd hackathon-client
npm run dev
```

Client sẽ chạy tại: `http://localhost:5173`

---

## 📡 Luồng hoạt động WebSocket

### **Khi user vào trang Chatbox:**

1. Frontend kết nối đến WebSocket server
2. Frontend join vào 2 room:
   - `{classroomId}-in_class`
   - `{classroomId}-off_topic`

### **Khi user gửi message:**

1. Frontend gọi API `/hackathon/send-message`
2. Backend validate qua n8n
3. Backend lưu message vào database
4. Backend broadcast message qua WebSocket đến room tương ứng
5. Tất cả clients trong room nhận được message và cập nhật UI

### **Khi user rời khỏi trang:**

1. Frontend leave khỏi các room
2. Frontend ngắt kết nối WebSocket

---

## 🔧 Cấu trúc Room

Room được đặt tên theo format: `{classroomId}-{type}`

**Ví dụ:**
- Classroom có ID = "123"
- Room in_class: `123-in_class`
- Room off_topic: `123-off_topic`

---

## 📨 Events WebSocket

### **Client → Server**

| Event | Data | Mô tả |
|-------|------|-------|
| `joinClassroom` | `{ classroomId, chatBoxId, type }` | Tham gia vào room |
| `leaveClassroom` | `{ classroomId, type }` | Rời khỏi room |
| `updateChatStatus` | `{ classroomId, type, isActive }` | Cập nhật trạng thái chat |

### **Server → Client**

| Event | Data | Mô tả |
|-------|------|-------|
| `joinedClassroom` | `{ room, message }` | Xác nhận đã join thành công |
| `messageReceived` | `{ id, content, type, createdAt, chatboxId }` | Nhận tin nhắn mới |
| `chatStatusChanged` | `{ isActive }` | Trạng thái chat thay đổi |

---

## 🧪 Cách test

### **1. Mở 2 tab trình duyệt**

- Tab 1: `http://localhost:5173` - User A
- Tab 2: `http://localhost:5173` - User B

### **2. Cùng vào 1 classroom**

- Cả 2 user login và vào cùng 1 classroom

### **3. Gửi message từ Tab 1**

- Nhập message và gửi
- Tab 2 sẽ tự động nhận và hiển thị message mới **không cần reload**

### **4. Kiểm tra Console**

**Backend console:**
```
✅ Client connected: xyz123
🚪 Client xyz123 joined room: 123-in_class
📩 Broadcasting to room 123-in_class: { ... }
```

**Frontend console:**
```
✅ Connected to WebSocket server: xyz123
🚪 Joining room: 123-in_class
📨 Received new message: { ... }
```

---

## 🛠️ Tùy chỉnh thêm

### **Thêm typing indicator**

**Backend - Gateway:**
```typescript
@SubscribeMessage('userTyping')
handleTyping(
  @MessageBody() data: { classroomId: string; type: string; userName: string },
  @ConnectedSocket() client: Socket,
) {
  const roomName = `${data.classroomId}-${data.type}`;
  client.to(roomName).emit('userTypingStatus', {
    userName: data.userName,
    isTyping: true,
  });
}
```

**Frontend:**
```javascript
// Khi user đang gõ
socketService.socket.emit('userTyping', {
  classroomId: state.classroomId,
  type: activeTab === 'class' ? 'in_class' : 'off_topic',
  userName: 'User A',
});

// Lắng nghe
socketService.socket.on('userTypingStatus', (data) => {
  console.log(\`\${data.userName} is typing...\`);
});
```

### **Thêm online users counter**

**Backend:**
```typescript
handleConnection(client: Socket) {
  const clientsCount = this.server.engine.clientsCount;
  this.server.emit('onlineUsers', { count: clientsCount });
}
```

**Frontend:**
```javascript
socketService.socket.on('onlineUsers', (data) => {
  console.log(\`Users online: \${data.count}\`);
});
```

---

## 🐛 Troubleshooting

### **Lỗi: Connection refused**

- Kiểm tra backend đã chạy chưa
- Kiểm tra port 10000 có bị chiếm chưa

### **Lỗi: CORS**

- Kiểm tra origin trong `ws.gateway.ts` đã đúng chưa
- Đảm bảo frontend chạy đúng port 5173

### **Message không realtime**

- Mở DevTools → Network → WS để xem WebSocket connection
- Kiểm tra console log để xem events
- Đảm bảo đã join đúng room

### **Duplicate messages**

- Kiểm tra không tạo multiple socket connections
- Đảm bảo cleanup trong useEffect đúng cách

---

## 📚 Tài liệu tham khảo

- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Socket.IO Rooms](https://socket.io/docs/v4/rooms/)

---

## ✨ Best Practices

1. **Sử dụng Room** để tổ chức messages theo classroom
2. **Cleanup connections** khi component unmount
3. **Handle reconnection** tự động
4. **Validate data** trước khi broadcast
5. **Log events** để dễ debug
6. **Use singleton** cho socket service
7. **Emit events sau khi lưu DB** để đảm bảo data consistency

---

**Chúc bạn triển khai thành công! 🎉**
