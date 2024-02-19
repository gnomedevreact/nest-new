import { IsArray, MaxLength, MinLength } from "class-validator";

export class RoomDto {
  @IsArray()
  userIds: string[];
}
