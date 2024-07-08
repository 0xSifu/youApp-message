import { Injectable, Inject, Logger } from '@nestjs/common';
import { Prisma, Message } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageService {
    private readonly logger = new Logger(MessageService.name);

    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        this.initialize();
    }

    async initialize() {
        try {
            await this.authClient.connect();
            this.logger.log('Connected to RabbitMQ');
        } catch (error) {
            this.logger.error('Error connecting to RabbitMQ:', error);
        }
    }

    async createMessage(data: Prisma.MessageCreateInput): Promise<Message> {
        try {
            const newMessage = await this.prisma.message.create({ data });
            await this.sendNotification(newMessage);
            return newMessage;
        } catch (error) {
            this.logger.error(`Error creating message: ${error.message}`);
            throw error;
        }
    }

    async findAllMessages(): Promise<Message[]> {
        try {
            return await this.prisma.message.findMany();
        } catch (error) {
            this.logger.error(`Error fetching messages: ${error.message}`);
            throw error;
        }
    }

    async findMessageById(id: string): Promise<Message | null> {
        try {
            return await this.prisma.message.findUnique({ where: { id } });
        } catch (error) {
            this.logger.error(`Error finding message by ID ${id}: ${error.message}`);
            throw error;
        }
    }

    async updateMessage(id: string, data: Prisma.MessageUpdateInput): Promise<Message> {
        try {
            return await this.prisma.message.update({ where: { id }, data });
        } catch (error) {
            this.logger.error(`Error updating message with ID ${id}: ${error.message}`);
            throw error;
        }
    }

    async deleteMessage(id: string): Promise<Message> {
        try {
            return await this.prisma.message.delete({ where: { id } });
        } catch (error) {
            this.logger.error(`Error deleting message with ID ${id}: ${error.message}`);
            throw error;
        }
    }

    private async sendNotification(message: Message): Promise<void> {
        try {
            const notificationData = {
                userId: message.receiverId,
                message: `New message received: ${message.content}`,
                timestamp: new Date().toISOString(),
            };

            await this.authClient.emit('notification_event', notificationData);

            this.logger.log(`Notification sent for message ID ${message.id}`);
        } catch (error) {
            this.logger.error(`Error sending notification: ${error.message}`);
        }
    }
}