import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Message } from '@prisma/client';
import { MessageService } from '../services/message.service';
import { CreateMessageDto, UpdateMessageDto, ViewMessageDto } from '../dtos/message.dto';
import { ApiTags } from '@nestjs/swagger';
import { IAuthPayload } from 'src/interfaces/auth.interface';
import { AuthUser } from 'src/decorators/auth.decorator';

@ApiTags('message')
@Controller({
  version: '1',
  path: 'message',
})

export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(
    @AuthUser() user: IAuthPayload,
    @Body() data: CreateMessageDto,
  ): Promise<Message> {
    return this.messageService.createMessage(data);
  }

  @Get()
  async getAllMessage(): Promise<Message[]> {
    return this.messageService.findAllMessages();
  }

  @Get(':id')
  async getCategoryById(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<Message | null> {
    return this.messageService.findMessageById(id);
  }

  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: string,
    @Body() data: UpdateMessageDto,
  ): Promise<Message> {
    return this.messageService.updateMessage(id, data);
  }

  @Delete(':id')
  async deleteCategory(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<Message> {
    return this.messageService.deleteMessage(id);
  }
}
