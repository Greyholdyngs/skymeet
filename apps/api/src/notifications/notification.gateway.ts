import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Server, Socket } from 'socket.io';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema.js';

interface AuthenticatedSocket extends Socket {
    data: { userId: string };
}

@WebSocketGateway({
    namespace: '/notifications',
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
})
export class NotificationGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly jwtService: JwtService,

        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async handleConnection(client: AuthenticatedSocket): Promise<void> {
        try {
            const authToken = client.handshake.auth?.token;
            const authorization = client.handshake.headers.authorization;

            const token = typeof authToken === 'string' ? authToken : authorization?.startsWith('Bearer ')
                                                        ? authorization.slice(7) : null;

            if (!token) {
                client.disconnect(true);
                return;
            }
            const payload = await this.jwtService.verifyAsync<{ sub: string; tokenVersion?: number; }>(token);

            if (!Types.ObjectId.isValid(payload.sub)) {
                client.disconnect(true);
                return;
            }
            const user = await this.userModel.findById(payload.sub).select('tokenVersion').lean().exec();

            if ( !user || (payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0) ) {
                client.disconnect(true);
                return;
            }

            client.data.userId = payload.sub;
            await client.join(`user:${payload.sub}`);
            
        } catch {
            client.disconnect(true);
        }
    }

    handleDisconnect(client: AuthenticatedSocket): void {}

    sendToUser(userId: string, notification: unknown): void {
        this.server.to(`user:${userId}`).emit('notification:new', notification);
    }
}

