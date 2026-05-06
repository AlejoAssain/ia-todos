import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStepDto {
  @IsInt()
  taskId: number;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  content: string;

  @IsInt()
  @IsOptional()
  position?: number;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
