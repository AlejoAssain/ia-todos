import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Short title for the task.',
    example: 'Prepare portfolio presentation',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @ApiPropertyOptional({
    description:
      'Optional task description. When omitted, the backend asks the configured AI provider to infer one from the title.',
    example: 'Create a concise presentation showing the project goal, tech stack, and current MVP status.',
    minLength: 5,
    maxLength: 150,
  })
  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmedValue = value.trim();

    return trimmedValue === '' ? undefined : trimmedValue;
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(150)
  description?: string;
}
