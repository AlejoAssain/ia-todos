import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @IsString()
  // @IsOptional()
  @MinLength(5)
  @MaxLength(150)
  description: string;
}
