import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('✅ Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('❌ Client disconnected:', client.id);
  }

  // Join vào room của classroom
  @SubscribeMessage('joinClassroom')
  handleJoinClassroom(
    @MessageBody() data: { classroomId: string; chatBoxId: string; type: 'in_class' | 'off_topic' },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `${data.classroomId}-${data.type}`;
    client.join(roomName);
    console.log(`🚪 Client ${client.id} joined room: ${roomName}`);
    
    client.emit('joinedClassroom', { 
      room: roomName, 
      message: 'Joined successfully' 
    });
  }

  // Leave room
  @SubscribeMessage('leaveClassroom')
  handleLeaveClassroom(
    @MessageBody() data: { classroomId: string; type: 'in_class' | 'off_topic' },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `${data.classroomId}-${data.type}`;
    client.leave(roomName);
    console.log(`🚪 Client ${client.id} left room: ${roomName}`);
  }

  // Gửi tin nhắn mới (được gọi từ service sau khi lưu DB)
  @SubscribeMessage('newMessage')
  handleNewMessage(
    @MessageBody() data: { 
      classroomId: string; 
      type: 'in_class' | 'off_topic';
      message: any;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `${data.classroomId}-${data.type}`;
    console.log(`📩 Broadcasting to room ${roomName}:`, data.message);
    
    // Gửi đến tất cả clients trong room (trừ người gửi)
    client.to(roomName).emit('messageReceived', data.message);
    
    // Hoặc gửi cho tất cả (kể cả người gửi)
    // this.server.to(roomName).emit('messageReceived', data.message);
  }

  // Broadcast message đến tất cả trong room
  broadcastToRoom(roomName: string, event: string, data: any) {
    this.server.to(roomName).emit(event, data);
  }

  // Cập nhật trạng thái chat (mở/đóng)
  @SubscribeMessage('updateChatStatus')
  handleUpdateChatStatus(
    @MessageBody() data: { 
      classroomId: string; 
      type: 'in_class' | 'off_topic';
      isActive: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `${data.classroomId}-${data.type}`;
    this.server.to(roomName).emit('chatStatusChanged', { 
      isActive: data.isActive 
    });
  }
}
