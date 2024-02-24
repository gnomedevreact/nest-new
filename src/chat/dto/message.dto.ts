import { IsBoolean, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  message: string;

  @IsString()
  to_id: string;

  @IsString()
  from_id: string;

  @IsString()
  roomId: string;

  @IsBoolean()
  image: boolean;
}
