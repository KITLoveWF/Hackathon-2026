# WebSocket - Hướng dẫn nhanh

## 🎯 Tóm tắt

WebSocket đã được tích hợp hoàn chỉnh cho real-time chat giữa Backend (NestJS) và Frontend (React).

---

## 📁 Files đã thay đổi/tạo mới

### **Backend**
1. ✅ `hackathon/src/gateway/ws.gateway.ts` - WebSocket Gateway
2. ✅ `hackathon/src/hackathon/service/hackathon.service.ts` - Tích hợp broadcast
3. ✅ `hackathon/src/hackathon/hackathon.module.ts` - Import WsGateway

### **Frontend**
1. ✅ `hackathon-client/src/services/socketService.js` - Socket service (MỚI)
2. ✅ `hackathon-client/src/pages/Chatbox.jsx` - Tích hợp WebSocket

---

## 🚀 Chạy thử nghiệm

### **1. Khởi động Backend**
```bash
cd hackathon
npm run start:dev
```

### **2. Khởi động Frontend**
```bash
cd hackathon-client
npm run dev
```

### **3. Test Real-time**
1. Mở 2 tab trình duyệt
2. Login và vào cùng 1 classroom
3. Gửi message từ tab 1
4. Tab 2 tự động nhận message **không cần reload**

---

## 📊 Luồng hoạt động

```
User gửi message
    ↓
Frontend gọi API POST /hackathon/send-message
    ↓
Backend validate qua n8n
    ↓
Backend lưu vào Database
    ↓
Backend broadcast qua WebSocket
    ↓
Tất cả users trong room nhận message
    ↓
UI tự động update
```

---

## 🔑 Key Features

✅ **Real-time messaging** - Tin nhắn hiện ngay lập tức  
✅ **Room-based** - Mỗi classroom có 2 room (in_class, off_topic)  
✅ **Auto reconnect** - Tự động kết nối lại khi mất kết nối  
✅ **Singleton pattern** - 1 WebSocket connection duy nhất  
✅ **Cleanup** - Tự động dọn dẹp khi rời trang  

---

## 📝 Events chính

### Client → Server
- `joinClassroom` - Tham gia room
- `leaveClassroom` - Rời room

### Server → Client
- `messageReceived` - Nhận tin nhắn mới
- `chatStatusChanged` - Trạng thái chat thay đổi

---

## 🎨 Demo Console Log

**Khi gửi message:**
```
Backend:
📩 Broadcasting to room 123-in_class: { id, content, ... }

Frontend (Tab 2):
📨 Received new message: { id, content, type, ... }
```

---

Xem chi tiết trong **WEBSOCKET_GUIDE.md**
