import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateEmptyStepDto {
  @ApiProperty({
    description: 'ID of the task that will receive the empty step.',
    example: 1,
  })
  @IsInt()
  taskId: number;

  @ApiPropertyOptional({
    description:
      'Position of the empty step inside the task. When omitted, the step is appended to the end.',
    example: 2,
  })
  @IsInt()
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({
    description: 'Initial completion status for the empty step.',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
