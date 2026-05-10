import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateStepDto {
  @ApiPropertyOptional({
    description: 'Updated step text.',
    example: 'Refine the presentation outline',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  content?: string;

  @ApiPropertyOptional({
    description: 'Updated position of the step inside its task.',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({
    description: 'Updated completion status for the step.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
