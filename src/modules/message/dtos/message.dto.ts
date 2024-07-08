import { IsNotEmpty, IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsMongoId()
  senderId: string;

  @IsNotEmpty()
  @IsMongoId()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  content?: string;
}

export class ViewMessageDto {
  @IsNotEmpty()
  @IsMongoId()
  messageId: string;

  @IsNotEmpty()
  @IsMongoId()
  senderId: string;

  @IsNotEmpty()
  @IsMongoId()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  createdAt: Date;
  updatedAt: Date;
}