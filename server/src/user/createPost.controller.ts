import { IsString, IsNotEmpty, IsInt, IsPositive, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  userId: number;
}