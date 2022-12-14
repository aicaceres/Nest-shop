import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { JwtPayload } from './../auth/interfaces';
import { MessageWsService } from './message-ws.service';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    this.wss.emit('messages-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no-message',
    });
    //! Emit only to the client
    // client.emit('message-from-server', {
    //   fullName: 'fullname',
    //   message: payload.message || 'no-message',
    // });

    // Emit to others but not to client
    // client.broadcast.emit('messages-from-server', {
    //   fullName: 'fullname',
    //   message: payload.message || 'no-message',
    // });
  }
}
