import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStepDto {
  @ApiProperty({
    description: 'ID of the task that will receive the step.',
    example: 1,
  })
  @IsInt()
  taskId: number;

  @ApiProperty({
    description: 'Human-readable step text.',
    example: 'Draft the presentation outline',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  content: string;

  @ApiPropertyOptional({
    description:
      'Position of the step inside the task. When omitted, the step is appended to the end.',
    example: 3,
  })
  @IsInt()
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({
    description: 'Initial completion status for the step.',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
