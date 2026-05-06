import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateStepDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  content?: string;

  @IsInt()
  @IsOptional()
  position?: number;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
