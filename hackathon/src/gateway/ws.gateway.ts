// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';

// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: 'http://localhost:5173',
//     credentials: true,
//   },
// })
// export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   handleConnection(client: Socket) {
//     console.log('Client connected:', client.id);
//   }

//   handleDisconnect(client: Socket) {
//     console.log('Client disconnected:', client.id);
//   }

//   @SubscribeMessage('message')
//   onMessage(
//     @MessageBody() data: any,
//     @ConnectedSocket() client: Socket,
//   ) {
//     console.log('📩 Received:', data);

//     // Broadcast đến tất cả client
//     this.server.emit('message', {
//       from: client.id,
//       ...data,
//     });
//   }
// }
